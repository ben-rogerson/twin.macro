import getConfigValue from './../utils/getConfigValue'
import { throwIf, maybeAddAlpha, getFirstValue, isObject } from './../utils'
import { errorSuggestions, logBadGood } from './../logging'
import { supportsArbitraryValues } from './../configHelpers'
import { getCoercedValueFromTypeMap } from './../coerced'
import { maybeAddNegative } from './helpers'

const getDynamicStyle = (config, { classValue, theme, pieces }) => {
  // Array values loop over cooerced object - { coerced: { color: () => {}, length () => {} } }
  if (config.coerced) {
    const coerced = ([type, config], forceReturn) =>
      getCoercedValueFromTypeMap(type, {
        value: classValue,
        config,
        pieces,
        theme,
        forceReturn,
      })
    const [result] = getFirstValue(
      Object.entries(config.coerced),
      (type, { isLast }) => coerced(type, isLast)
    )
    return result
  }

  const value = Array.isArray(classValue)
    ? classValue.join(', ')
    : maybeAddNegative(maybeAddAlpha(classValue, { pieces }), pieces.negative)
  return Array.isArray(config.property)
    ? // FIXME: Remove comment and fix next line
      // eslint-disable-next-line unicorn/prefer-object-from-entries
      config.property.reduce((result, p) => ({ ...result, [p]: value }), {})
    : { [config.property]: value }
}

export default props => {
  const { theme, pieces, state, corePluginName, coreConfig } = props
  const { classNameRaw, className, classNameNoSlashAlpha } = pieces

  const configSearch = [className.slice(Number(corePluginName.length) + 1)]

  // eg: names including a slash, eg: h-1/5
  if (className !== classNameNoSlashAlpha)
    configSearch.push(
      classNameNoSlashAlpha.slice(Number(corePluginName.length) + 1)
    )

  const [result, configUsed] = getFirstValue(coreConfig, c => {
    const isStaticOutput =
      corePluginName === pieces.className && isObject(c.output)
    if (isStaticOutput) return c.output

    const config = c.config && theme(c.config)
    const classValue = config && getConfigValue(config, configSearch)
    if (config && !classValue) return

    // { property: value } determined via a function (eg: 'container')
    if (typeof c.output === 'function')
      return c.output({
        value: maybeAddNegative(classValue, pieces.negative),
        isEmotion: state.isEmotion,
        theme,
        pieces,
      })

    if (c.output) return

    return getDynamicStyle(c, { ...props, classValue })
  })

  throwIf(!result || className.endsWith('-'), () =>
    errorSuggestions({
      pieces,
      state,
      config: coreConfig.map(item => item.config).filter(Boolean),
      corePluginName,
    })
  )

  throwIf(pieces.hasNegative && !configUsed.supportsNegativeValues, () =>
    logBadGood(
      `“${classNameRaw}” doesn’t support a negative prefix`,
      [
        `Remove the negative prefix`,
        supportsArbitraryValues(corePluginName) &&
          `apply an arbitrary value, eg: “${corePluginName}-[-5]” or “-${corePluginName}-[5]”`,
      ]
        .filter(Boolean)
        .join(' or ')
    )
  )

  throwIf(pieces.hasImportant && configUsed.supportsImportant === false, () =>
    logBadGood(
      `“${classNameRaw}” doesn’t support the important modifier`,
      'Remove the bang (!) from the class'
    )
  )

  return result
}
