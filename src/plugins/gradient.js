import { transparentTo } from './../utils'

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
      '--tw-gradient-from': getColorValue(value, 'from'),
      '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${transparentTo(
        value
      )})`,
    },
    via: {
      '--tw-gradient-stops': `var(--tw-gradient-from), ${getColorValue(
        value,
        'via'
      )}, var(--tw-gradient-to, ${transparentTo(value)})`,
    },
    to: {
      '--tw-gradient-to': getColorValue(value, 'to'),
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
