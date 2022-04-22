import deepMerge from 'lodash.merge'

/**
 * Add important to a value
 * Only used for static and dynamic styles - not core plugins
 */
const mergeImportant = (style, hasImportant) => {
  if (!hasImportant) return style
  // Bail if the ruleset already has an important
  if (JSON.stringify(style).includes(' !important')) return style

  return Object.entries(style).reduce((result, item) => {
    const [key, value] = item
    if (typeof value === 'object') return mergeImportant(value, hasImportant)

    // Don't add important to css variables
    const newValue = key.startsWith('--') ? value : `${value} !important`

    return deepMerge(result, { [key]: newValue })
  }, {})
}

const transformImportant = ({ style, pieces: { hasImportant } }) =>
  mergeImportant(style, hasImportant)

const applyTransforms = context => {
  if (!context.style) return
  return transformImportant(context)
}

export default applyTransforms
