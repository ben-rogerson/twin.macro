export default properties => {
  const common = {
    matchStart: 'accent',
    property: 'accentColor',
    configSearch: 'accentColor',
  }
  const color = properties.toColor([
    { ...common, useSlashAlpha: false },
    common,
  ])
  if (!color) properties.errors.errorSuggestions({ config: 'accentColor' })

  return color
}
