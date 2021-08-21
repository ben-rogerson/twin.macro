export default properties => {
  const common = {
    matchStart: 'caret',
    property: 'caretColor',
    configSearch: 'caretColor',
  }
  const color = properties.toColor([
    { ...common, useSlashAlpha: false },
    common,
  ])
  if (!color) properties.errors.errorSuggestions({ config: 'caretColor' })

  return color
}
