const handleOpacity = ({ configValue }) => {
  const value = configValue('placeholderOpacity') || configValue('opacity')
  if (!value) return

  return { '::placeholder': { '--tw-placeholder-opacity': `${value}` } }
}

export default properties => {
  const {
    match,
    theme,
    getConfigValue,
    getCoerced,
    errors: { errorSuggestions },
  } = properties

  const opacityMatch =
    match(/(?<=(placeholder-opacity-))([^]*)/) || match(/^placeholder-opacity$/)
  const opacity = handleOpacity({
    configValue: config => getConfigValue(theme(config), opacityMatch),
  })
  if (opacity) return opacity

  const coercedColor = getCoerced('color')
  if (coercedColor) return coercedColor

  errorSuggestions({
    config: [
      'placeholderColor',
      theme('placeholderOpacity') ? 'placeholderOpacity' : 'opacity',
    ],
  })
}
