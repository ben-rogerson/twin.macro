import stringSimilarity from 'string-similarity'
import { corePlugins } from './../config'
import { getTypeCoerced, getCoercedValueFromTypeMap } from './../coerced'
import {
  throwIf,
  withAlpha,
  splitOnFirst,
  isObject,
  getFirstValue,
} from './../utils'
import { logNotAllowed, logBadGood } from './../logging'
import {
  getFlatCoercedConfigByProperty,
  getCorePluginsByProperty,
  supportsArbitraryValues,
} from './../configHelpers'
import { replaceThemeValue, maybeAddNegative } from './helpers'

const hasSupport = item =>
  getCorePluginsByProperty(item).some(i => supportsArbitraryValues(i))

const sortRatingHighestFirst = (a, b) => b.rating - a.rating

const getSuggestions = (results, { color, value }) =>
  results
    .filter(r => r.rating > 0.25)
    .sort(sortRatingHighestFirst)
    .slice(0, 5)
    .sort((a, b) => Number(hasSupport(b.target)) - Number(hasSupport(a.target)))
    .map(s => {
      const dash = color.subdued('-')
      return `${dash} ${
        hasSupport(s.target)
          ? `${s.target}-[${value}] ${dash} ${color.success(
              '✓ Arbitrary value support'
            )}`
          : `${s.target} ${dash} ${color.highlight('Static class')}`
      }`
    })

const getErrorFeedback = (property, value) => {
  const coercedConfig = getFlatCoercedConfigByProperty(property) || {}

  const config = Object.entries(coercedConfig)
  if (config.length > 0)
    return [
      'needs a type hint before the value',
      color =>
        `Specify the type:\n\n${config
          .map(([pluginName, pluginConfig]) => {
            const dash = color.subdued('-')
            return `${dash} ${property}-[${color.highlight(
              pluginName
            )}:${value}] ${dash} ${pluginConfig.property}`
          })
          .join('\n')}`,
    ]

  return [
    'was not found',
    color => {
      const pluginKeys = Object.keys(corePlugins)
      const results = stringSimilarity.findBestMatch(
        property,
        pluginKeys
      ).ratings
      const suggestions = getSuggestions(results, { color, value })
      return `Did you mean ${
        suggestions.length > 1 ? 'one of these' : 'this'
      }?\n\n${suggestions.join('\n')}`
    },
  ]
}

const getClassData = className => {
  const [property, value] = splitOnFirst(className, '[')
  return [
    property.slice(0, -1), // Remove the dash just before the brackets
    value.slice(0, -1).replace(/_/g, ' ').trim(), // Remove underscores, the last ']' and whitespace
  ]
}

const getArbitraryStyle = (
  config,
  { classValue, theme, pieces, property, state }
) => {
  if (!supportsArbitraryValues(config)) return

  // Type-coerced arbitrary values, eg: text-[length:3px] / text-[color:red]
  const typeCoerced = getTypeCoerced(classValue, {
    theme,
    pieces,
    property,
  })
  if (typeCoerced) return typeCoerced

  if (typeof config.output === 'function')
    return config.output({
      value: maybeAddNegative(classValue, pieces.negative),
      color: props => withAlpha(props),
      negative: pieces.negative,
      isEmotion: state.isEmotion,
      theme,
    })

  // Non-coerced class
  if (config.coerced === undefined) {
    const value = maybeAddNegative(classValue, pieces.negative)
    return Array.isArray(config.property)
      ? // eslint-disable-next-line unicorn/prefer-object-from-entries
        config.property.reduce((result, p) => ({ ...result, [p]: value }), {})
      : { [config.property]: value }
  }

  if (!isObject(config.coerced)) return

  // Arbitrary value matched with array of coerced types
  const [coercedConfigResult] = getFirstValue(
    Object.entries(config.coerced),
    ([type, coercedConfig]) =>
      getCoercedValueFromTypeMap(type, {
        config: coercedConfig,
        value: classValue,
        pieces,
        theme,
      })
  )
  return coercedConfigResult
}

export default props => {
  const [property, value] = getClassData(props.pieces.classNameNoSlashAlpha)

  // Replace theme values, eg: `bg-[theme(color.red.500)]`
  const classValue = replaceThemeValue(value, { theme: props.theme })

  const config = getCorePluginsByProperty(property)

  const [result, configUsed] = getFirstValue(config, p =>
    getArbitraryStyle(p, { ...props, property, classValue })
  )

  throwIf(!result, () =>
    logNotAllowed(
      props.pieces.classNameRawNoVariants,
      ...getErrorFeedback(property, classValue)
    )
  )

  throwIf(props.pieces.hasNegative && !configUsed.supportsNegativeValues, () =>
    logBadGood(
      `“${props.pieces.classNameRaw}” doesn’t support a negative prefix`,
      `Apply the negative to the arbitrary value, eg: “${property}-[-5]”`
    )
  )

  return result
}
