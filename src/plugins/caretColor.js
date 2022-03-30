export default properties => {
  const coercedColor = properties.getCoerced('color')
  if (!coercedColor)
    properties.errors.errorSuggestions({ config: 'caretColor' })

  return coercedColor
}
