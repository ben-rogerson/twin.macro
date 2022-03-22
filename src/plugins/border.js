export default properties => {
  const {
    getCoercedLength,
    getCoercedColor,
    errors: { errorSuggestions },
    dynamicConfig: { coerced },
  } = properties

  const coercedLength = getCoercedLength(coerced.length)
  if (coercedLength) return coercedLength

  const coercedColor = getCoercedColor(coerced.color)
  if (coercedColor) return coercedColor

  errorSuggestions({ config: Object.values(coerced).map(v => v.property) })
}
