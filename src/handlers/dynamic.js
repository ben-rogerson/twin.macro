import { logNoClass } from './../logging'
import { assert, getConfigValue, stripNegative } from './../utils'

// Convert an array of objects into a single object
const styleify = ({ property, value, negative }) => {
  value = Array.isArray(value)
    ? value.join(', ')
    : negative
    ? stripNegative(value)
    : value
  return Array.isArray(property)
    ? property.reduce(
        (results, item) => ({ ...results, [item]: `${negative}${value}` }),
        {}
      )
    : { [property]: `${negative}${value}` }
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
    .filter(item => item.value)[0]

  assert(!results || className.endsWith('-'), () =>
    logNoClass({
      pieces,
      state,
      config: styleSet.map(item => item.config) || [],
      dynamicKey,
    })
  )

  return styleify(results)
}
