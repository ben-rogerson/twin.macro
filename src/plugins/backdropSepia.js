export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(backdrop-sepia)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropSepia')
  if (!value) {
    errorSuggestions({ config: ['backdropSepia'] })
  }

  const backdropSepiaValue = Array.isArray(value)
    ? value.map(v => `sepia(${v})`).join(' ')
    : `sepia(${value})`
  return { '--tw-backdrop-sepia': backdropSepiaValue }
}
