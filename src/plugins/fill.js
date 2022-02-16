export default properties => {
  const coercedColor = properties.getCoercedColor('fill')
  if (!coercedColor) properties.errors.errorSuggestions({ config: 'fill' })

  return coercedColor
}
