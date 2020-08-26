import { withAlpha } from './../utils'

const handleColor = ({ configValue, important }) => {
  const value = configValue('textColor')
  if (!value) return

  return withAlpha({
    color: value,
    property: 'color',
    variable: '--text-opacity',
    important,
  })
}

const handleSize = ({ configValue, important }) => {
  const value = configValue('fontSize')
  if (!value) return

  const [fontSize, options] = Array.isArray(value) ? value : [value]

  const lineHeight = options instanceof Object ? options.lineHeight : options
  const letterSpacing = options && options.letterSpacing

  return {
    fontSize: `${fontSize}${important}`,
    ...(lineHeight && {
      lineHeight: `${lineHeight}${important}`,
    }),
    ...(letterSpacing && {
      letterSpacing: `${letterSpacing}${important}`,
    }),
  }
}

export default properties => {
  const {
    match,
    theme,
    getConfigValue,
    pieces: { important, hasNegative },
    errors: { errorSuggestions, errorNoNegatives },
  } = properties

  hasNegative && errorNoNegatives()

  const classValue = match(/(?<=(text-))([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const color = handleColor({ configValue, important })
  if (color) return color

  const size = handleSize({ configValue, important })
  if (size) return size

  errorSuggestions({ config: ['textColor', 'fontSize'] })
}
