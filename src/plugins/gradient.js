import { toRgba } from './../utils'

const transparentTo = value => {
  if (typeof value === 'function') {
    return value({ opacityValue: 0 })
  }

  try {
    const [r, g, b] = toRgba(value)
    return `rgba(${r}, ${g}, ${b}, 0)`
  } catch (_) {
    return `rgba(255, 255, 255, 0)`
  }
}

export default properties => {
  const {
    match,
    theme,
    getConfigValue,
    pieces: { hasNegative, hasImportant, className },
    errors: { errorNoNegatives, errorNoImportant, errorSuggestions },
  } = properties

  const classValue = match(/(?<=(from-|via-|to-))([^]*)/)

  const configValue = config => getConfigValue(theme(config), classValue)
  if (!configValue) return

  const value = configValue('gradientColorStops')
  !value && errorSuggestions({ config: 'gradientColorStops' })

  const getColorValue = color =>
    typeof color === 'function' ? value({}) : color

  const styleDefinitions = {
    from: {
      '--gradient-from-color': getColorValue(value, 'from'),
      '--gradient-color-stops': `var(--gradient-from-color), var(--gradient-to-color, ${transparentTo(
        value
      )})`,
    },
    via: {
      '--gradient-via-color': getColorValue(value, 'via'),
      '--gradient-color-stops': `var(--gradient-from-color), var(--gradient-via-color), var(--gradient-to-color, ${transparentTo(
        value
      )})`,
    },
    to: {
      '--gradient-to-color': getColorValue(value, 'to'),
    },
  }

  const [, styles] =
    Object.entries(styleDefinitions).find(([k]) =>
      className.startsWith(`${k}-`)
    ) || []

  !styles && errorSuggestions({ config: 'gradientColorStops' })
  hasNegative && errorNoNegatives()
  hasImportant && errorNoImportant()

  return styles
}
