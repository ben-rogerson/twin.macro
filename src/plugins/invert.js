export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(invert)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('invert')
  if (!value) {
    errorSuggestions({ config: ['invert'] })
  }

  const invertValue = Array.isArray(value)
    ? value.map(v => `invert(${v})`).join(' ')
    : `invert(${value})`

  return { '--tw-invert': invertValue }
}
