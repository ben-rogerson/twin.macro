import { logNoClass } from './../logging'
import { assert, getConfigValue } from './../utils'

// Convert an array of objects into a single object
// Shallow merger
const styleify = ({ property, value, negative }) => {
  value = Array.isArray(value) ? value.join(', ') : value
  return Array.isArray(property)
    ? property.reduce(
        (results, item) => ({ ...results, [item]: `${negative}${value}` }),
        {}
      )
    : { [property]: `${negative}${value}` }
}

export default ({ theme, pieces, state, dynamicKey, dynamicConfig }) => {
  const { className, negative } = pieces
  const key = className.slice(Number(dynamicKey.length) + 1)
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

  assert(
    !results,
    logNoClass({
      className: `${negative}${className}`,
      hasSuggestions: state.hasSuggestions,
      config: (!results && styleSet.map(item => theme(item.config))) || {},
    })
  )

  return styleify(results)
}
