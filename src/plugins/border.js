export default properties => {
  const {
    getCoercedLength,
    getCoercedColor,
    errors: { errorSuggestions },
  } = properties

  const coercedLength = getCoercedLength('borderWidth')
  if (coercedLength) return coercedLength

  const coercedColor = getCoercedColor('borderColor')
  if (coercedColor) return coercedColor

  errorSuggestions({ config: ['borderColor', 'borderWidth'] })
}
