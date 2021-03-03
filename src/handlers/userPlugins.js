import { isEmpty } from './../utils'

const reorderAtRules = className =>
  className &&
  Object.entries(className)
    .sort((a, b) => {
      const [aKey] = a
      const [bKey] = b
      const A = aKey.startsWith('@') ? 1 : 0
      const B = bKey.startsWith('@') ? 1 : 0
      return B > A ? -1 : 0
    })
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

// If these tasks return true then the rule is matched
const mergeChecks = [
  // Match exact selector
  ({ key, className }) => key === className,
  // Match class selector (inc dot)
  ({ key, className }) =>
    !key.includes('{{') &&
    key.match(
      new RegExp(`(?:^|>|~|\\+|\\*| )\\.${className}(?: |>|~|\\+|\\*|:|$)`, 'g')
    ),
  // Match parent selector placeholder
  ({ key, className }) => key.includes(`{{${className}}}`),
  // Match possible symbols after the selector (ex dot)
  ({ key, className }) =>
    [(' ', ':', '>', '~', '+', '*')].some(suffix =>
      key.startsWith(`${className}${suffix}`)
    ),
]

const getMatches = ({ className, data, sassyPseudo }) =>
  Object.entries(data).reduce((result, item) => {
    let [key, value] = item
    key = key.replace(/\\/g, '') // Unescape characters

    const childValue = Object.values(value)[0]
    const hasChildNesting =
      !Array.isArray(childValue) && typeof childValue === 'object'
    if (hasChildNesting) {
      const matches = getMatches({
        className,
        data: value,
        sassyPseudo,
      })
      if (!isEmpty(matches)) return { ...result, [key]: matches }
    }

    const shouldMergeValue = mergeChecks.some(item =>
      item({ key, value, className, data })
    )

    if (shouldMergeValue) {
      const newKey = formatKey(key, className, sassyPseudo)
      return newKey ? { ...result, [newKey]: value } : { ...result, ...value }
    }

    return result
  }, {})

// The key gets formatted with these checks
const formatTasks = [
  ({ key }) => key.replace(/\\/g, '').trim(),
  // Replace the parent selector placeholder
  ({ key, className }) => {
    const parentSelectorIndex = key.indexOf(`{{${className}}}`)
    const replacement = parentSelectorIndex > 0 ? '&' : ''
    return key.replace(`{{${className}}}`, replacement)
  },
  // Replace the classname at start of selector (postCSS supplies flattened selectors)
  ({ key, className }) =>
    key.startsWith(`.${className}`) ? key.slice(`.${className}`.length) : key,
  ({ key }) => key.trim(),
  // Add the parent selector at the start when it has the sassy pseudo enabled
  ({ key, sassyPseudo }) =>
    sassyPseudo && key.startsWith(':') ? `&${key}` : key,
  // Remove the unmatched class wrapping
  ({ key }) => key.replace(/{{/g, '.').replace(/}}/g, ''),
]

const formatKey = (selector, className, sassyPseudo) => {
  if (selector === className) return

  let key = selector
  for (const task of formatTasks) {
    key = task({ key, className, sassyPseudo })
  }

  return key
}

export default ({
  state: {
    configTwin: { sassyPseudo },
    userPluginData: { components, utilities },
  },
  className,
}) => {
  let result
  ;[components, utilities].find(data => {
    const matches = getMatches({ className, data, sassyPseudo })
    const hasMatches = !isEmpty(matches)
    result = hasMatches ? matches : result
    return hasMatches
  })
  return reorderAtRules(result)
}
