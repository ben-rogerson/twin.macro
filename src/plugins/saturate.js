export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(saturate)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('saturate')
  if (!value) {
    errorSuggestions({ config: ['saturate'] })
  }

  const saturateValue = Array.isArray(value)
    ? value.map(v => `saturate(${v})`).join(' ')
    : `saturate(${value})`

  return { '--tw-saturate': saturateValue }
}
