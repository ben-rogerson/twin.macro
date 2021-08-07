export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(blur)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('blur')
  if (!value) {
    errorSuggestions({ config: ['blur'] })
  }

  const blurValue = Array.isArray(value)
    ? value.map(v => `blur(${v})`).join(' ')
    : `blur(${value})`

  return {
    '--tw-blur': blurValue,
    filter: `var(--tw-filter)${important}`,
  }
}
