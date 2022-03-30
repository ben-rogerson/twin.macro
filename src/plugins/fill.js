export default properties => {
  const coercedColor = properties.getCoerced('color')
  if (!coercedColor) properties.errors.errorSuggestions({ config: 'fill' })

  return coercedColor
}
