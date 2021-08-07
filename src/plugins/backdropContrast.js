export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(backdrop-contrast)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropContrast')
  if (!value) {
    errorSuggestions({ config: ['backdropContrast'] })
  }

  const backdropContrastValue = Array.isArray(value)
    ? value.map(v => `contrast(${v})`).join(' ')
    : `contrast(${value})`
  return {
    '--tw-backdrop-contrast': backdropContrastValue,
    backdropFilter: `var(--tw-backdrop-filter)${important}`,
  }
}
