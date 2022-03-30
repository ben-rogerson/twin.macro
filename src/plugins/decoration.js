export default properties => {
  const {
    getCoerced,
    dynamicConfig: { coerced },
    pieces: { hasNegative },
    errors: { errorSuggestions, errorNoNegatives },
  } = properties

  hasNegative && errorNoNegatives()

  const coercedColor = getCoerced('color')
  if (coercedColor) return coercedColor

  const coercedLength = getCoerced('length')
  if (coercedLength) return coercedLength

  const coercedPercentage = getCoerced('percentage')
  if (coercedPercentage) return coercedPercentage

  const coercedAny = getCoerced('any')
  if (coercedAny) return coercedAny

  errorSuggestions({ config: [coerced.length, coerced.color] })
}
