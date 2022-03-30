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
    getCoerced,
    getConfigValue,
    pieces: { important, hasNegative },
    errors: { errorSuggestions, errorNoNegatives },
  } = properties

  hasNegative && errorNoNegatives()

  const coercedColor = getCoerced('color')
  if (coercedColor) return coercedColor

  const classValue = match(/(?<=(text-))([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const size = handleSize({ configValue, important })
  if (size) return size

  errorSuggestions({ config: ['textColor', 'fontSize'] })
}
