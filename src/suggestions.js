import { staticStyles, dynamicStyles } from './config'
import { getTheme } from './utils'
import stringSimilarity from 'string-similarity'

const getCustomSuggestions = className => {
  const suggestions = {
    'center-align': 'items-center',
    'flex-center': 'items-center / justify-center',
    'inline-block': 'block',
    'display-none': 'hidden',
    'display-inline': 'inline-block',
    'display-flex': 'flex',
    'border-radius': 'rounded',
  }[className]
  if (suggestions) return suggestions
}

const flattenObject = (object, prefix = '') =>
  Object.keys(object).reduce((result, k) => {
    const pre = prefix.length > 0 ? prefix + '-' : ''
    if (typeof object[k] === 'object')
      Object.assign(result, flattenObject(object[k], pre + k))
    else result[pre + k] = object[k]
    return result
  }, {})

const targetTransforms = [
  ({ target }) => (target === 'default' ? '' : target),
  ({ target }) => (target.endsWith('-default') ? target.slice(0, -8) : target),
  ({ dynamicKey, target }) => [dynamicKey, target].filter(Boolean).join('-'),
]

const normalizeDynamicConfig = ({ config, input, dynamicKey }) =>
  Object.entries(flattenObject(config))
    .map(([target, value]) => ({
      ...(input && {
        rating: stringSimilarity.compareTwoStrings(`-${target}`, input),
      }),
      target: targetTransforms.reduce(
        (result, transform) => transform({ dynamicKey, target: result }),
        target
      ),
      value,
    }))
    .filter(
      i =>
        !i.target.includes('-array-') &&
        (typeof i.rating === 'undefined' || i.rating >= 0.15)
    )

const matchConfig = ({ config, theme, className, dynamicKey }) =>
  Object.values(
    [...config].reduce(
      (results, item) => ({
        ...results,
        ...normalizeDynamicConfig({
          config: theme(item),
          input: className,
          dynamicKey,
        }),
      }),
      {}
    )
  ).sort((a, b) => b.rating - a.rating)

const getConfig = ({ config, theme, dynamicKey }) =>
  matchConfig({ config, theme, dynamicKey }).slice(0, 20)

const getSuggestions = ({
  pieces: { className },
  state,
  config,
  dynamicKey,
}) => {
  const theme = getTheme(state.config.theme)

  const customSuggestions = getCustomSuggestions(className)
  if (customSuggestions) return customSuggestions

  if (config) {
    const dynamicMatches = matchConfig({
      config,
      theme,
      dynamicKey,
      className,
    })
    if (dynamicMatches.length === 0) {
      return getConfig({ config, theme, dynamicKey })
    }

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
