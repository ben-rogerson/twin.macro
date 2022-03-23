import { staticStyles, dynamicStyles } from './config'
import { getTheme, stripNegative, isEmpty } from './utils'
import stringSimilarity from 'string-similarity'

const getCustomSuggestions = className => {
  const suggestions = {
    'flex-center': 'items-center / justify-center',
    'display-none': 'hidden',
    'display-inline': 'inline-block',
    'display-flex': 'flex',
    'border-radius': 'rounded',
    'flex-column': 'flex-col',
    'flex-column-reverse': 'flex-col-reverse',
    'text-italic': 'italic',
    'text-normal': 'font-normal / not-italic',
    ellipsis: 'text-ellipsis',
    'flex-no-wrap': 'flex-nowrap',
  }[className]
  if (suggestions) return suggestions
}

const flattenObject = (object, prefix = '') => {
  if (!object) return {}

  return Object.keys(object).reduce((result, k) => {
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
}

const targetTransforms = [
  ({ target }) => (target === 'DEFAULT' ? '' : target),
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
        [k.replace('-DEFAULT', '')]: v,
      }),
    }),
    {}
  )

const normalizeDynamicConfig = ({ config, input, dynamicKey, hasNegative }) => {
  const results = Object.entries(
    filterKeys(flattenObject(config), hasNegative)
  ).map(([target, value]) => ({
    ...(input && {
      rating: stringSimilarity.compareTwoStrings(`-${target}`, input),
    }),
    target: targetTransforms.reduce(
      (result, transformer) => transformer({ dynamicKey, target: result }),
      target
    ),
    value: JSON.stringify(value), // Make sure objects are flattened and viewable
  }))

  const filteredResults = results.filter(
    item =>
      !item.target.includes('-array-') &&
      (input.rating ? typeof item.rating !== 'undefined' : true)
  )

  return filteredResults
}

const matchConfig = ({ config, theme, className, ...rest }) =>
  [...config]
    .reduce(
      (results, item) =>
        results.concat(
          normalizeDynamicConfig({
            config: theme(item),
            input: className,
            ...rest,
          })
        ),
      []
    )
    .sort((a, b) => b.rating - a.rating)

const getConfig = properties =>
  matchConfig({ ...properties, className: null }).slice(0, 20)

const getSuggestions = ({
  pieces: { className, hasNegative },
  state,
  config,
  dynamicKey,
}) => {
  const customSuggestions = getCustomSuggestions(className)
  if (customSuggestions) return customSuggestions

  if (config) {
    const theme = getTheme(state.config.theme)
    const properties = { config, theme, dynamicKey, className, hasNegative }
    const dynamicMatches = matchConfig(properties)
    if (dynamicMatches.length === 0) return getConfig(properties)
    // Check if the user means to select a default class
    const defaultFound = dynamicMatches.find(
      match =>
        match.target.endsWith('-default') &&
        match.target.replace('-default', '') === className
    )
    if (defaultFound) return defaultFound.target

    // If there's a high rated suggestion then return it
    const trumpMatches = dynamicMatches.filter(match => match.rating >= 0.5)
    if (!isEmpty(trumpMatches)) return trumpMatches

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
    .ratings.filter(item => item.rating > 0.25)

  const hasNoMatches = matches.every(match => match.rating === 0)
  if (hasNoMatches) return []

  const sortedMatches = matches.sort((a, b) => b.rating - a.rating)

  const trumpMatch = sortedMatches.find(match => match.rating >= 0.6)
  if (trumpMatch) return trumpMatch.target

  return sortedMatches.slice(0, 6)
}

export { getSuggestions as default }
