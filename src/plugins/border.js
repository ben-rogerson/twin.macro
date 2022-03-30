export default properties => {
  const {
    getCoerced,
    errors: { errorSuggestions },
    dynamicConfig: { coerced },
  } = properties

  const coercedLength = getCoerced('length')
  if (coercedLength) return coercedLength

  const coercedColor = getCoerced('color')
  if (coercedColor) return coercedColor

  errorSuggestions({ config: Object.values(coerced).map(v => v.property) })
}
