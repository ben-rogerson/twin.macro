export default properties => {
  const coercedColor = properties.getCoercedColor('accentColor')
  if (coercedColor) return coercedColor

  return properties.errors.errorSuggestions({ config: 'accentColor' })
}
