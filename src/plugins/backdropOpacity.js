export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(backdrop-opacity)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropOpacity')
  if (!value) {
    errorSuggestions({ config: ['backdropOpacity'] })
  }

  const backdropOpacityValue = Array.isArray(value)
    ? value.map(v => `opacity(${v})`).join(' ')
    : `opacity(${value})`
  return { '--tw-backdrop-opacity': backdropOpacityValue }
}
