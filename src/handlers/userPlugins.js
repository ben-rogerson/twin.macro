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

const mergeValueStatements = [
  // Match exact selector
  ({ key, className }) => key === className,
  // Match class selector (whole word)
  ({ key, className }) =>
    key.match(new RegExp(`(?:^| ).${className}(?: |:|$)`, 'g')),
  // Match parent selector placeholder
  ({ key, className }) => key.includes(`{{${className}}}`),
  // Match possible symbols after the selector
  ({ key, className }) =>
    [' ', ':', '>', '~', '+', '*'].some(suffix =>
      key.startsWith(`${className}${suffix}`)
    ),
]

const getMatches = ({ className, data, sassyPseudo }) =>
  Object.entries(data).reduce((result, item) => {
    let [key, value] = item
    key = key.replace(/\\/g, '') // Unescape characters

    const subKeyValue = Object.values(value)[0]
    const isObject =
      !Array.isArray(subKeyValue) && typeof subKeyValue === 'object'
    if (isObject) {
      const subMatches = getMatches({ className, data: value, sassyPseudo })
      if (!isEmpty(subMatches)) return { ...result, [key]: subMatches }
    }

    const shouldMergeValue = mergeValueStatements.findIndex(item =>
      item({ key, value, className })
    )

    if (shouldMergeValue >= 0) {
      const newKey = formatKey(key, className, sassyPseudo)
      return newKey ? { ...result, [newKey]: value } : { ...result, ...value }
    }

    return result
  }, {})

const replacementTasks = [
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
  // Replace parent selector with ampsersand within
  ({ key, className }) => {
    const matches = key.match(new RegExp(`(?:^| ).${className}(?: |:|$)`, 'g'))
    const match = matches && matches[0].trim()
    return match ? key.replace(match, '&') : key
  },
  ({ key }) => key.trim(),
  // Add the parent selector at the start when it has the sassy pseudo enabled
  ({ key, sassyPseudo }) =>
    sassyPseudo && key.startsWith(':') ? `&${key}` : key,
]

const formatKey = (selector, className, sassyPseudo) => {
  if (selector === className) return

  let key = selector
  for (const task of replacementTasks) {
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
