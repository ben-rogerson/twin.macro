import stringSimilarity from 'string-similarity'
import { SPACE_ID } from './../contants'
import { dynamicStyles } from './../config'
import { maybeAddNegative } from './../negative'
import { coercedTypeMap, getCoercedValue } from './../coerced'
import { throwIf, withAlpha, isEmpty, splitOnFirst, getTheme } from './../utils'
import { logBadGood } from './../logging'

const searchDynamicConfigByProperty = propertyName => {
  const found = Object.entries(dynamicStyles).find(([k]) => propertyName === k)
  if (!found) return

  const result = found[1]
  if (result.length > 1) {
    return {
      value: result.map(r => r.value).flat(),
      coerced: Object.assign({}, ...result.map(r => r.coerced)),
    }
  }

  return result
}

const showSuggestions = (property, value) => {
  const suggestions = getSuggestions(property, value)
  throwIf(true, () =>
    logBadGood(
      `The arbitrary class “${property}” in “${property}-[${value}]” wasn’t found`,
      suggestions.length > 0 && `Try one of these:\n\n${suggestions.join(', ')}`
    )
  )
}

const getSuggestions = (property, value) => {
  const results = stringSimilarity.findBestMatch(
    property,
    Object.keys(dynamicStyles).filter(s => s.hasArbitrary !== 'false')
  )
  const suggestions = results.ratings.filter(item => item.rating > 0.25)

  return suggestions.length > 0
    ? suggestions.map(s => `${s.target}-[${value}]`)
    : []
}

const getClassData = className => {
  const [property, value] = splitOnFirst(
    className
      // Replace the "stand-in spaces" with real ones
      .replace(new RegExp(SPACE_ID, 'g'), ' '),
    '['
  )
  return {
    property: property.slice(0, -1), // Remove the dash just before the brackets
    value: value.slice(0, -1).replace(/_/g, ' ').trim(), // Remove underscores, the last ']' and whitespace
  }
}

export default ({ state, pieces }) => {
  let { property, value } = getClassData(pieces.classNameNoSlashAlpha)

  let config = searchDynamicConfigByProperty(property) || {}

  // Check for coerced value
  // Values that have their type specified: [length:3px]/[color:red]/etc
  const coercedConfig = Array.isArray(config)
    ? config.map(c => c.coerced)
    : config.coerced
  const coercedValue = getCoercedValue(value, {
    property,
    pieces,
    state,
    coercedConfig,
  })
  if (coercedValue) return coercedValue

  // Theme values, eg: tw`text-[theme(colors.red.500)]`
  const themeValue = value.match(/theme\('?([^']+)'?\)/)
  if (themeValue) {
    const val = getTheme(state.config.theme)(themeValue[1])
    if (val) value = val
  }

  // Deal with font array
  if (Array.isArray(config)) {
    const value = config.find(c => c.value)
    value && (config = value)
  }

  ;(isEmpty(config) || Array.isArray(config)) &&
    showSuggestions(property, value)

  throwIf(config.hasArbitrary === false, () =>
    logBadGood(
      `There is no support for the arbitrary value “${property}” in “${property}-[${value}]”`
    )
  )

  if (Array.isArray(config.value)) {
    let arbitraryValue
    config.value.find(type => {
      const result = coercedTypeMap[type]({
        config: config.coerced[type],
        value,
        pieces,
        theme: getTheme(state.config.theme),
      })
      if (result) arbitraryValue = result
      return Boolean(result)
    })

    throwIf(!arbitraryValue, () =>
      logBadGood(
        `The arbitrary value in “${property}-[${value}]” isn’t valid`,
        `Replace “${value}” with a valid ${config.value.join(
          ' or '
        )} based value`
      )
    )

    return arbitraryValue
  }

  if (pieces.hasAlpha) {
    throwIf(!config.coerced || !config.coerced.color, () =>
      logBadGood(
        `There is no support for a “${property}” alpha value in “${property}-[${value}]”`
      )
    )
    return coercedTypeMap.color({
      config: config.coerced.color,
      value,
      pieces,
      theme: getTheme(state.config.theme),
    })
  }

  const arbitraryProperty = config.prop

  const color = props => withAlpha({ color: value, pieces, ...props })

  const arbitraryValue =
    typeof config.value === 'function'
      ? config.value({
          value,
          color,
          negative: pieces.negative,
          isEmotion: state.isEmotion,
        })
      : maybeAddNegative(value, pieces.negative)

  // Raw values - no prop value found in config
  if (!arbitraryProperty)
    return arbitraryValue || showSuggestions(property, value)

  if (Array.isArray(arbitraryProperty))
    return arbitraryProperty.reduce(
      (result, p) => ({ ...result, [p]: arbitraryValue }),
      {}
    )

  return { [arbitraryProperty]: arbitraryValue }
}
