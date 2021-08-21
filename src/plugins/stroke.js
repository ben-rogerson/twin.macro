const handleColor = ({ toColor }) => {
  const common = {
    matchStart: 'stroke',
    property: 'stroke',
    configSearch: 'stroke',
  }
  return toColor([{ ...common, useSlashAlpha: false }, common])
}

const handleWidth = ({ configValue, important }) => {
  const value = configValue('strokeWidth')
  if (!value) return

  return {
    strokeWidth: `${value}${important}`,
  }
}

const handleCustom = ({ classValue, important }) => {
  if (classValue !== 'non-scaling') return

  return {
    vectorEffect: `non-scaling-stroke${important}`,
  }
}

export default properties => {
  const {
    theme,
    match,
    toColor,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const color = handleColor({ toColor })
  if (color) return color

  const classValue = match(/(?<=(stroke)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const width = handleWidth({ configValue, important })
  if (width) return width

  const custom = handleCustom({ classValue, important })
  if (custom) return custom

  errorSuggestions({ config: ['stroke', 'strokeWidth'] })
}
