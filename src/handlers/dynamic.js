import getConfigValue from './../utils/getConfigValue'
import { throwIf, isNumeric } from './../utils'
import { errorSuggestions } from './../logging'

const maybeAddNegative = (value, negative) => {
  if (!negative) return value

  return isNumeric(value.slice(0, 1)) ? `${negative}${value}` : value
}

const styleify = ({ property, value, negative }) => {
  value = Array.isArray(value)
    ? value.join(', ')
    : maybeAddNegative(value, negative)
  return Array.isArray(property)
    ? property.reduce((results, item) => ({ ...results, [item]: value }), {})
    : { [property]: value }
}

export default ({ theme, pieces, state, dynamicKey, dynamicConfig }) => {
  const { className, negative } = pieces
  const key = `${negative}${className.slice(Number(dynamicKey.length) + 1)}`

  const grabConfig = ({ config, configFallback }) =>
    (config && theme(config)) || (configFallback && theme(configFallback))

  const styleSet = Array.isArray(dynamicConfig)
    ? dynamicConfig
    : [dynamicConfig]

  const results = styleSet
    .map(item => ({
      property: item.prop,
      value: getConfigValue(grabConfig(item), key),
      negative,
    }))
    .find(item => item.value)

  throwIf(!results || className.endsWith('-'), () =>
    errorSuggestions({
      pieces,
      state,
      config: styleSet.map(item => item.config) || [],
      dynamicKey,
    })
  )

  return styleify(results)
}
