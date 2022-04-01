import deepMerge from 'lodash.merge'
import { throwIf, withAlpha, splitOnFirst, getTheme } from './utils'
import { opacityErrorNotFound, logBadGood } from './logging'
import {
  image,
  url,
  length,
  lineWidth,
  position,
  shadow,
  absoluteSize,
  relativeSize,
  percentage,
  genericName,
  familyName,
  number,
} from 'tailwindcss/lib/util/dataTypes'
import { makeBoxShadow } from './boxShadow'

const alpha = ({ pieces, property, variable }) => (
  color,
  alpha,
  fallBackColor
) => {
  const newPieces = alpha ? { ...pieces, alpha, hasAlpha: true } : pieces
  return withAlpha({
    color,
    property,
    variable,
    pieces: newPieces,
    fallBackColor,
  })
}

const coercedTypeMap = {
  any: ({ config, value }) => {
    const { property, wrapWith } = config
    const result = { [property]: value }

    if (wrapWith) return { [wrapWith]: result }
    return result
  },
  color: ({ config, value, pieces, forceReturn }) => {
    const { property, variable, wrapWith } = config
    if (typeof config.output === 'function')
      return config.output(value, {
        withAlpha: alpha({ pieces, property, variable }),
      })

    if (!property) return

    const properties = Array.isArray(property) ? property : [property]
    let result = properties
      .map(p => {
        let colorOutput

        if (typeof value === 'string' && value.startsWith('var('))
          colorOutput = { [p]: `${value}${pieces.important}` }

        colorOutput =
          colorOutput ||
          withAlpha({
            color: value,
            property: p,
            pieces,
            ...(variable && { variable }),
          })

        return wrapWith && colorOutput
          ? { [wrapWith]: colorOutput }
          : colorOutput
      })
      .filter(Boolean)

    if (result.length === 0) {
      if (!forceReturn) return
      result = properties.map(p => {
        const output = { [p]: `${value}${pieces.important}` }
        return wrapWith && output ? { [wrapWith]: output } : output
      })
    }

    return deepMerge(...result)
  },
  'line-width': ({ config, value, theme, forceReturn }) => {
    if (typeof config === 'function') return config(value, theme)
    if (!forceReturn && !lineWidth) return
    return { [config.property]: value }
  },
  length: ({ config, value, theme, forceReturn }) => {
    if (typeof config === 'function') return config(value, theme)
    if (!forceReturn && !length(value) && !value.startsWith('var(')) return

    const { property, variable, wrapWith } = config
    if (!property) return

    const properties = Array.isArray(property) ? property : [property]
    const result = Object.fromEntries(
      properties.map(p => [
        p,
        variable ? `calc(${value} * var(${variable}))` : value,
      ])
    )

    const resultWithVariable = {
      ...(variable && { [variable]: '0' }),
      ...result,
    }
    if (wrapWith) return { [wrapWith]: resultWithVariable }

    return resultWithVariable
  },
  number: ({ config, value, forceReturn }) => {
    if (!forceReturn && !number(value)) return
    return { [config.property]: value }
  },
  'absolute-size': ({ config, value, forceReturn }) => {
    if (!forceReturn && !absoluteSize(value)) return
    return { [config.property]: value }
  },
  'relative-size': ({ config, value, forceReturn }) => {
    if (!forceReturn && !relativeSize(value)) return
    return { [config.property]: value }
  },
  percentage: ({ config, value, forceReturn }) => {
    if (!forceReturn && !percentage(value)) return
    return { [config.property]: value }
  },
  image: ({ value, config, forceReturn }) => {
    if (!forceReturn && !image(value)) return
    return { [config.property]: value }
  },
  url: ({ value, config, forceReturn }) => {
    if (!forceReturn && !url(value)) return
    return { [config.property]: value }
  },
  position: ({ value, config, forceReturn }) => {
    if (!forceReturn && !position(value)) return
    return { [config.property]: value }
  },
  shadow: ({ value, pieces, forceReturn }) => {
    if (!forceReturn && !shadow(value)) return
    return makeBoxShadow(value, pieces.important)
  },
  lookup: ({ config, value, theme }) =>
    typeof config === 'function' && config(value, theme),
  'generic-name': ({ value, config, forceReturn }) => {
    if (!forceReturn && !genericName(value)) return
    return { [config.property]: value }
  },
  'family-name': ({ value, config, forceReturn }) => {
    if (!forceReturn && !familyName(value)) return
    return { [config.property]: value }
  },
}

const getCoercedValue = (customValue, context) => {
  const [explicitType, value] = splitOnFirst(customValue, ':')
  if (value.length === 0) return

  const { coercedConfig } = context
  const coercedOptions = Object.keys(coercedConfig || {})

  throwIf(!coercedOptions.includes(explicitType), () =>
    logBadGood(
      `\`${context.property}-[${explicitType}:${value}]\` < The coerced value of “${explicitType}” isn’t available`,
      coercedOptions.length > 0
        ? `Try one of these coerced classes:\n\n${coercedOptions
            .map(o => {
              const config = coercedConfig[o]
              const propertyUsed = config ? config.property : ''
              return `\`${context.property}-[${o}:${value}]\`${
                propertyUsed ? ` to use \`${propertyUsed}\`` : ''
              }`
            })
            .join('\n')}`
        : `\`${context.property}-[${value}]\` < Add ${context.property} without a coerced value`
    )
  )

  const result = coercedTypeMap[explicitType]({
    config: coercedConfig[explicitType],
    value,
    pieces: context.pieces,
    theme: getTheme(context.state.config.theme),
    forceReturn: true,
  })

  // Return coerced values even when they aren't validated
  if (!result) {
    const { property } = coercedConfig[explicitType]
    return { [property]: value }
  }

  return result
}

const getCoerced = ({ pieces, theme, config, matchConfig }) => type => {
  const coercedConfig = config && config[type]
  if (!coercedConfig) return

  const value = matchConfig(
    coercedConfig.config || coercedConfig.property || coercedConfig
  )
  if (!value) return

  throwIf(!['color', 'any'].includes(type) && pieces.hasAlpha, () =>
    opacityErrorNotFound({ className: pieces.classNameRaw })
  )

  return coercedTypeMap[type]({
    value,
    config: coercedConfig,
    pieces,
    theme,
    forceReturn: true,
  })
}

export { coercedTypeMap, getCoercedValue, getCoerced }
