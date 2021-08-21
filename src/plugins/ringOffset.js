const handleColor = ({ toColor }) => {
  const common = {
    matchStart: 'ring-offset',
    property: '--tw-ring-offset-color',
    configSearch: 'ringOffsetColor',
  }
  return toColor([{ ...common, useSlashAlpha: false }, common])
}

export default properties => {
  const {
    toColor,
    matchConfigValue,
    errors: { errorSuggestions },
  } = properties

  const width = matchConfigValue('ringOffsetWidth', /(?<=(ring-offset)-)([^]*)/)
  if (width) return { '--tw-ring-offset-width': width }

  const color = handleColor({ toColor })
  if (color) return color

  errorSuggestions({
    config: ['ringOffsetWidth', 'ringOffsetColor'],
  })
}
