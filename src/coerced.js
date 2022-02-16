import deepMerge from 'lodash.merge'
import { throwIf, withAlpha, splitOnFirst, getTheme, isLength } from './utils'
import { opacityErrorNotFound, logBadGood } from './logging'

const coercedTypeMap = {
  all: ({ config, value, theme }) => config(value, theme),
  color: ({ config, value, pieces, theme, hasFallback }) => {
    if (typeof config === 'function') return config(value, theme)
    const { property, variable, wrapWith } = config
    if (!property) return

    const values = Array.isArray(property) ? property : [property]
    const result = values
      .map(p => {
        const colorOutput = withAlpha({
          color: value,
          property: p,
          pieces,
          hasFallback,
          ...(variable && { variable }),
        })

        if (colorOutput && wrapWith) return { [wrapWith]: colorOutput }

        return colorOutput
      })
      .filter(Boolean)
    if (result.length === 0) return

    return deepMerge(...result)
  },
  length: ({ config, value, theme }) => {
    if (!isLength(value) && !value.startsWith('var(')) return

    if (typeof config === 'function') return config(value, theme)
    const { property, variable, wrapWith } = config
    if (!property) return

    const values = Array.isArray(property) ? property : [property]
    const result = Object.fromEntries(
      values.map(p => [
        p,
        variable ? `calc(${value} * var(${variable}))` : value,
      ])
    )

    const out = { ...(variable && { [variable]: '0' }), ...result }
    if (wrapWith) return { [wrapWith]: out }

    return out
  },
  url: ({ value }) => {
    if (!value.startsWith('url(')) return
    return { backgroundImage: value } // TODO: Get correct property
  },
  lookup: ({ config, value, theme }) => config(value, theme),
}

const getCoercedValue = (customValue, context) => {
  const [explicitType, value] = splitOnFirst(customValue, ':')
  if (value.length === 0) return

  const coercedConfig = context.config.coerced
  if (!coercedConfig) return

  const coercedOptions = Object.keys(coercedConfig)
  throwIf(!coercedOptions.includes(explicitType), () =>
    logBadGood(
      `The coerced value of “${explicitType}” isn’t available`,
      `Try one of these coerced classes:\n\n${coercedOptions
        .map(o => `${context.property}-[${o}:${value}]`)
        .join(', ')}`
    )
  )

  const result = coercedTypeMap[explicitType]({
    config: coercedConfig[explicitType],
    value,
    pieces: context.pieces,
    theme: getTheme(context.state.config.theme),
  })
  return result
}

const getCoercedColor = ({
  pieces,
  theme,
  config,
  matchConfig,
}) => configKey => {
  if (!config) return

  // Match config including a custom slash alpha, eg: bg-black/[.5]
  const keys = Array.isArray(configKey) ? configKey : [configKey]
  let value
  keys.find(k => {
    const match = matchConfig(k)
    if (match) value = match
    return match
  })
  if (!value) return

  return coercedTypeMap.color({ value, config, pieces, theme })
}

const getCoercedLength = ({
  pieces,
  theme,
  config,
  matchConfig,
}) => configKey => {
  const value = matchConfig(configKey)
  if (!value) return

  throwIf(pieces.hasAlpha, () =>
    opacityErrorNotFound({
      className: pieces.classNameRaw,
    })
  )

  return coercedTypeMap.length({ value, config, pieces, theme })
}

export { coercedTypeMap, getCoercedValue, getCoercedColor, getCoercedLength }
