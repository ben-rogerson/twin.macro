import deepMerge from 'lodash.merge'
import {
  throwIf,
  toAlpha,
  splitOnFirst,
  isSpaceSeparatedColor,
  isObject,
  toArray,
} from './utils'
import { opacityErrorNotFound, logNotAllowed } from './logging'
import {
  image,
  url,
  color,
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
import { getFlatCoercedConfigByProperty } from './configHelpers'

const coercedTypeMap = {
  any: ({ output, value }) => output(value),
  color({ config, value, pieces, forceReturn }) {
    const { property, variable } = config

    if (typeof config.output === 'function')
      return config.output(value, {
        withAlpha: toAlpha({ pieces, property, variable }),
      })

    if (
      !forceReturn &&
      typeof value === 'string' &&
      !color(value) &&
      !isSpaceSeparatedColor(value)
    )
      return

    const properties = toArray(property)
    let result = properties
      .map(p =>
        typeof value === 'string' && value.startsWith('var(')
          ? null
          : toAlpha({ pieces, variable, property: p })(value, pieces.alpha)
      )
      .filter(Boolean)

    if (result.length === 0)
      result = properties.map(p => ({ [p]: `${value}${pieces.important}` }))

    // @ts-expect-error TODO: Investigate TS error
    return deepMerge(...result)
  },
  'line-width'({ config, value, theme, output, forceReturn }) {
    if (
      !forceReturn &&
      typeof value === 'string' &&
      !lineWidth(value) &&
      !value.startsWith('var(')
    )
      return
    if (typeof config === 'function') return config(value, theme)
    return output(value)
  },
  length({ config, value, theme, forceReturn, output }) {
    if (
      !forceReturn &&
      typeof value === 'string' &&
      !length(value) &&
      !value.startsWith('var(')
    )
      return
    if (typeof config === 'function') return config(value, theme)
    const { variable } = config
    return {
      ...(variable && { [variable]: '0' }),
      ...output(variable ? `calc(${value} * var(${variable}))` : value),
    }
  },
  number({ output, value, forceReturn }) {
    if (!forceReturn && !number(value)) return
    return output(value)
  },
  'absolute-size'({ output, value, forceReturn }) {
    if (!forceReturn && !absoluteSize(value)) return
    return output(value)
  },
  'relative-size'({ output, value, forceReturn }) {
    if (!forceReturn && !relativeSize(value)) return
    return output(value)
  },
  percentage({ output, value, forceReturn }) {
    if (!forceReturn && !percentage(value)) return
    return output(value)
  },
  image({ output, value, forceReturn }) {
    if (typeof value !== 'string') return
    if (!forceReturn && !image(value)) return
    return output(value)
  },
  url({ output, value, forceReturn }) {
    if (typeof value !== 'string') return
    if (!forceReturn && !url(value) && !value.startsWith('var(')) return
    return output(value)
  },
  position({ output, value, forceReturn }) {
    if (!forceReturn && !position(value)) return
    return output(value)
  },
  shadow({ value, pieces, forceReturn }) {
    if (!forceReturn && !shadow(value)) return
    return makeBoxShadow(value, pieces.important)
  },
  lookup: ({ config, value, theme }) =>
    typeof config === 'function' && config(value, theme),
  'generic-name'({ output, value, forceReturn }) {
    if (typeof value !== 'string') return
    if (!forceReturn && !genericName(value)) return
    return output(value)
  },
  'family-name'({ output, value, forceReturn }) {
    if (typeof value !== 'string') return
    if (!forceReturn && !familyName(value)) return
    return output(value)
  },
}

const getTypeCoerced = (customValue, context) => {
  const [explicitType, value] = splitOnFirst(customValue, ':')
  if (value.length === 0) return

  const coercedConfig = getFlatCoercedConfigByProperty(context.property)

  throwIf(!coercedConfig, () =>
    logNotAllowed(
      context.pieces.className,
      `has no type support`,
      color =>
        `Remove the type: ${color.success(`${context.property}-[${value}]`)}`
    )
  )

  const coercedTypes = Object.keys(coercedConfig)

  throwIf(!coercedTypes.includes(explicitType), () =>
    logNotAllowed(
      context.pieces.className,
      `can’t use “${explicitType}” as a type`,
      color => {
        const suggestions = Object.entries(coercedConfig).map(
          ([type, config]) => {
            const dash = color.subdued('-')
            return `${dash} ${context.property}-[${color.highlight(
              type
            )}:${value}] to use ${color.highlight(config.property)}`
          }
        )
        if (suggestions.length === 0) return
        return `Try ${
          suggestions.length > 1 ? 'one of these' : 'this'
        }:\n\n${suggestions.join('\n')}`
      }
    )
  )

  const config = coercedConfig[explicitType]

  const result = getCoercedValueFromTypeMap(explicitType, {
    config,
    value,
    pieces: context.pieces,
    theme: context.theme,
    forceReturn: true,
  })

  // Force return defined coerced value as fallback
  // eg: tw`indent-[lookup:10px]`
  if (!result) return { [config.property]: value }

  return result
}

const applyStyleToProperty = (property, pieces) => style => {
  const properties = Array.isArray(property) ? property : [property]
  const styleValue = [pieces.negative, style].join('')
  const result = Object.fromEntries(properties.map(p => [p, styleValue]))
  return result
}

const getCoercedValueFromTypeMap = (type, context) => {
  context.output = applyStyleToProperty(context.config.property, context.pieces)

  let extraStyles
  if (Array.isArray(context.value)) {
    const [value, ...rest] = context.value
    if (rest.length === 1 && isObject(rest[0])) {
      extraStyles = rest[0]
      context.value = value
    } else {
      context.value = context.value.join(', ')
    }
  }

  let result = coercedTypeMap[type](context)
  if (!result) return

  result = { ...result, ...extraStyles }

  throwIf(!['color', 'any'].includes(type) && context.pieces.hasAlpha, () =>
    opacityErrorNotFound({ className: context.pieces.classNameRaw })
  )

  const { wrapWith } = context.config
  if (wrapWith) return { [wrapWith]: result }

  return result
}

export { getTypeCoerced, getCoercedValueFromTypeMap }
