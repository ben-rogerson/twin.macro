export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(contrast)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('contrast')
  if (!value) {
    errorSuggestions({ config: ['contrast'] })
  }

  const contrastValue = Array.isArray(value)
    ? value.map(v => `contrast(${v})`).join(' ')
    : `contrast(${value})`

  return {
    '--tw-contrast': contrastValue,
    filter: `var(--tw-filter)${important}`,
  }
}
