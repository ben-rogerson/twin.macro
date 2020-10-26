import { staticStyles, dynamicStyles } from './config'
import { getTheme, stripNegative } from './utils'
import stringSimilarity from 'string-similarity'

const getCustomSuggestions = className => {
  const suggestions = {
    'align-center': 'items-center',
    'center-align': 'items-center',
    'flex-center': 'items-center / justify-center',
    'inline-block': 'block',
    'display-none': 'hidden',
    'display-inline': 'inline-block',
    'display-flex': 'flex',
    'border-radius': 'rounded',
    'flex-column': 'flex-col',
    'flex-column-reverse': 'flex-col-reverse',
    'text-italic': 'italic',
    'text-normal': 'not-italic',
  }[className]
  if (suggestions) return suggestions
}

const flattenObject = (object, prefix = '') =>
  Object.keys(object).reduce((result, k) => {
    const pre = prefix.length > 0 ? prefix + '-' : ''

    const value = object[k]
    const fullKey = pre + k

    if (Array.isArray(value)) {
      result[fullKey] = value
    } else if (typeof value === 'object') {
      Object.assign(result, flattenObject(value, fullKey))
    } else {
      result[fullKey] = value
    }

    return result
  }, {})

const targetTransforms = [
  ({ target }) => (target === 'default' ? '' : target),
  ({ target }) => (target.endsWith('-default') ? target.slice(0, -8) : target),
  ({ dynamicKey, target }) => {
    const prefix = target !== stripNegative(target) ? '-' : ''
    return `${prefix}${[dynamicKey, stripNegative(target)]
      .filter(Boolean)
      .join('-')}`
  },
]

const filterKeys = (object, negativesOnly) =>
  Object.entries(object).reduce(
    (result, [k, v]) => ({
      ...result,
      ...((negativesOnly ? k.startsWith('-') : !k.startsWith('-')) && {
        [k]: v,
      }),
    }),
    {}
  )

const normalizeDynamicConfig = ({ config, input, dynamicKey, hasNegative }) =>
  Object.entries(filterKeys(flattenObject(config), hasNegative))
    .map(([target, value]) => ({
      ...(input && {
        rating: stringSimilarity.compareTwoStrings(`-${target}`, input),
      }),
      target: targetTransforms.reduce(
        (result, transformer) => transformer({ dynamicKey, target: result }),
        target
      ),
      value: `${value}`,
    }))
    .filter(
      i =>
        !i.target.includes('-array-') &&
        (typeof i.rating === 'undefined' || i.rating >= 0.15)
    )

const matchConfig = ({ config, theme, className, ...rest }) =>
  Object.values(
    [...config].reduce(
      (results, item) => ({
        ...results,
        ...normalizeDynamicConfig({
          config: theme(item),
          input: className,
          ...rest,
        }),
      }),
      {}
    )
  ).sort((a, b) => b.rating - a.rating)

const getConfig = properties =>
  matchConfig({ ...properties, className: null }).slice(0, 20)

const getSuggestions = ({
  pieces: { className, hasNegative },
  state,
  config,
  dynamicKey,
}) => {
  const theme = getTheme(state.config.theme)

  const customSuggestions = getCustomSuggestions(className)
  if (customSuggestions) return customSuggestions

  if (config) {
    const properties = {
      config,
      theme,
      dynamicKey,
      className,
      hasNegative,
    }
    const dynamicMatches = matchConfig(properties)
    if (dynamicMatches.length === 0) return getConfig(properties)

    // If there's a high rated suggestion then return it
    const trumpMatch = dynamicMatches.find(match => match.rating >= 0.6)
    if (trumpMatch) return trumpMatch.target

    return dynamicMatches
  }

  // Static or unmatched className
  const staticClassNames = Object.keys(staticStyles)
  const dynamicClassMatches = Object.entries(dynamicStyles)
    .map(([k, v]) =>
      typeof v === 'object' ? (v.default ? [k, v].join('-') : `${k}-...`) : null
    )
    .filter(Boolean)

  const matches = stringSimilarity
    .findBestMatch(className, [...staticClassNames, ...dynamicClassMatches])
    .ratings.filter(i => i.rating > 0.25)

  const hasNoMatches = matches.every(i => i.rating === 0)
  if (hasNoMatches) return []

  const trumpMatch = matches.find(match => match.rating >= 0.6)
  if (trumpMatch) return trumpMatch.target

  return matches.sort((a, b) => b.rating - a.rating).slice(0, 6)
}

export { getSuggestions as default }
