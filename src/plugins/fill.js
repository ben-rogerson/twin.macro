export default properties => {
  const common = { matchStart: 'fill', property: 'fill', configSearch: 'fill' }
  const color = properties.toColor([
    { ...common, useSlashAlpha: false },
    common,
  ])
  if (!color) properties.errors.errorSuggestions({ config: 'fill' })

  return color
}
