import stringSimilarity from 'string-similarity'
import { SPACE_ID } from './../contants'
import { dynamicStyles } from './../config'
import {
  throwIf,
  withAlpha,
  transparentTo,
  isEmpty,
  splitOnFirst,
} from './../utils'
import { logBadGood } from './../logging'

const searchDynamicConfigByProperty = propertyName => {
  const result = Object.entries(dynamicStyles).find(([k]) => propertyName === k)
  if (!result) return

  return result[1]
}

const showSuggestions = ({ classProperty, customValue }) => {
  const suggestions = getSuggestions(classProperty, customValue)
  throwIf(true, () =>
    logBadGood(
      `The arbitrary class “${classProperty}” in “${classProperty}-[${customValue}]” wasn’t found`,
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

export default ({ className, pieces }) => {
  let [classProperty, customValue] = splitOnFirst(
    className
      // Replace the "stand-in spaces" with real ones
      .replace(new RegExp(SPACE_ID, 'g'), ' '),
    '['
  )

  classProperty = classProperty.slice(0, -1) // Remove the dash just before the brackets
  customValue = customValue.slice(0, -1).trim() // Remove the last ']' and whitespace

  const config = searchDynamicConfigByProperty(classProperty) || {}

  ;(isEmpty(config) || Array.isArray(config)) &&
    showSuggestions({ classProperty, customValue })

  throwIf(config.hasArbitrary === false, () =>
    logBadGood(
      `There is no support for the arbitrary value “${classProperty}” in “${classProperty}-[${customValue}]”`
    )
  )

  const property = config.prop

  const filterColor = (properties, value) =>
    withAlpha({
      color: value,
      property: properties[1],
      variable: properties[0],
      important: pieces.important,
    })

  const value =
    typeof config.value === 'function'
      ? config.value({ value: customValue, filterColor, transparentTo })
      : customValue

  if (!property)
    return value ? value : showSuggestions({ classProperty, customValue })

  if (Array.isArray(property))
    return property.reduce((result, p) => ({ ...result, [p]: value }), {})

  return { [property]: value }
}
