import getConfigValue from './../utils/getConfigValue'
import { throwIf } from './../utils'
import { errorSuggestions } from './../logging'
import { maybeAddNegative } from './../negative'

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

  const getConfig = ({ config, configFallback }) =>
    (config && theme(config)) || (configFallback && theme(configFallback))

  const styleSet = Array.isArray(dynamicConfig)
    ? dynamicConfig
    : [dynamicConfig]

  const piece = className.slice(Number(dynamicKey.length) + 1)

  let results
  styleSet.find(item => {
    const value = getConfigValue(getConfig(item), piece)
    if (value) {
      results =
        typeof item.value === 'function'
          ? item.value({
            value,
            negative,
            isEmotion: state.isEmotion,
          })
          : styleify({
            property: item.prop,
            value,
            negative,
          })
    }

    return value
  })

  throwIf(!results || className.endsWith('-'), () =>
    errorSuggestions({
      pieces,
      state,
      config: styleSet.map(item => item.config) || [],
      dynamicKey,
    })
  )

  return results
}
