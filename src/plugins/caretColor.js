export default properties => {
  const coercedColor = properties.getCoercedColor('caretColor')
  if (!coercedColor)
    properties.errors.errorSuggestions({ config: 'caretColor' })

  return coercedColor
}
