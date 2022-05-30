import deepMerge from 'lodash.merge'
import { isEmpty, getFirstValue } from './../utils'
import { splitPrefix } from './../pieces'

// If these tasks return true then the rule is matched
const mergeChecks = [
  // Match exact selector
  ({ key, className }) => key === `${className}`,
  // Match class selector (inc dot)
  ({ key, className }) =>
    !key.includes('{{') &&
    key.match(
      new RegExp(
        `(?:^|>|~|\\+|\\*| )\\.${className.replace(
          /\[/g,
          '\\['
        )}(?: |>|~|\\+|\\*|:|$)`,
        'g'
      )
    ),
  // Match parent selector placeholder
  ({ key, className }) => key.includes(`{{${className}}}`),
  // Match possible symbols after the selector (ex dot)
  ({ key, className }) =>
    [' ', ':', '>', '~', '+', '*'].some(suffix =>
      key.startsWith(`${className}${suffix}`)
    ),
]

const getMatches = ({ className, data, sassyPseudo, state }) =>
  Object.entries(data).reduce((result, item) => {
    const [rawKey, value] = item
    // Remove the prefix before attempting match
    let { className: key } = splitPrefix({ className: rawKey, state })

    key = key.replace(/\\/g, '')

    const childValue = Object.values(value)[0]
    const hasChildNesting =
      !Array.isArray(childValue) && typeof childValue === 'object'
    if (hasChildNesting) {
      const matches = getMatches({ className, data: value, sassyPseudo, state })
      if (!isEmpty(matches)) return { ...result, [key]: matches }
    }

    const shouldMergeValue = mergeChecks.some(item => item({ key, className }))
    if (shouldMergeValue) {
      const newKey = formatKey(key, { className, sassyPseudo })
      return deepMerge({ ...result }, newKey ? { [newKey]: value } : value)
    }

    return result
  }, {})

// The key gets formatted with these checks
const formatTasks = [
  ({ key }) => key.replace(/\\/g, '').trim(),
  // Match exact selector
  ({ key, className }) => (key === `.${className}` ? '' : key),
  // Replace the parent selector placeholder
  ({ key, className }) => key.replace(new RegExp(`{{${className}}}`, 'g'), '&'),
  // Replace the classname at start of selector (eg: &:hover) (postCSS supplies
  // flattened selectors so it looks like .blah:hover at this point)
  ({ key, className }) =>
    key.startsWith(`.${className}`) ? key.slice(`.${className}`.length) : key,
  ({ key }) => key.trim(),
  // Add the parent selector at the start when it has the sassy pseudo enabled
  ({ key, sassyPseudo }) =>
    sassyPseudo && key.startsWith(':') ? `&${key}` : key,
  // Remove the unmatched class wrapping
  ({ key }) => key.replace(/{{/g, '.').replace(/}}/g, ''),
  // Fix class within where, eg: `:where(&)`
  ({ key }) => key.replace(/:where\(&\)/g, ''),
  // Hacky fix for spotty `:root` selector support in emotion/styled-components
  ({ key }) => key.replace(/(^| ):root(?!\w)/g, '*:root'),
]

const formatKey = (selector, { className, sassyPseudo }) => {
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
    userPluginData: { base, components, utilities },
  },
  state,
  className,
}) => {
  const [result] = getFirstValue([base, components, utilities], data => {
    const matches = getMatches({ className, data, sassyPseudo, state })
    if (isEmpty(matches)) return
    return matches
  })
  return result
}
