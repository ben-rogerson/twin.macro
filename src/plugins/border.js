const handleWidth = ({ configValue, important }) => {
  const value = configValue('borderWidth')
  if (!value) return

  return {
    borderWidth: `${value}${important}`,
  }
}

const handleColor = ({ toColor }) => {
  const common = {
    matchStart: 'border',
    property: 'borderColor',
    configSearch: 'borderColor',
  }
  return toColor([
    { ...common, opacityVariable: '--tw-border-opacity' },
    common,
  ])
}

export default properties => {
  const {
    match,
    theme,
    getConfigValue,
    toColor,
    pieces: { important },
    errors: { errorSuggestions },
  } = properties

  const width = handleWidth({
    configValue: config =>
      getConfigValue(theme(config), match(/(?<=(border-))([^]*)/)),
    important,
  })
  if (width) return width

  const color = handleColor({ toColor })
  if (color) return color

  errorSuggestions({ config: ['borderColor', 'borderWidth'] })
}
