export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(brightness)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('brightness')
  if (!value) {
    errorSuggestions({ config: ['brightness'] })
  }

  const brightnessValue = Array.isArray(value)
    ? value.map(v => `brightness(${v})`).join(' ')
    : `brightness(${value})`

  return {
    '--tw-brightness': brightnessValue,
    filter: `var(--tw-filter)${important}`,
  }
}
