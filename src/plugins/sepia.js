export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(sepia)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('sepia')
  if (!value) {
    errorSuggestions({ config: ['sepia'] })
  }

  const sepiaValue = Array.isArray(value)
    ? value.map(v => `sepia(${v})`).join(' ')
    : `sepia(${value})`

  return { '--tw-sepia': sepiaValue, filter: `var(--tw-filter)${important}` }
}
