const handleColor = ({ configValue, important }) => {
  const value = configValue('stroke')
  if (!value) return

  return {
    stroke: `${value}${important}`,
  }
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
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties
  const classValue = match(/(?<=(stroke)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const color = handleColor({ configValue, important })
  if (color) return color

  const width = handleWidth({ configValue, important })
  if (width) return width

  const custom = handleCustom({ classValue, important })
  if (custom) return custom

  errorSuggestions({ config: ['stroke', 'strokeWidth'] })
}
