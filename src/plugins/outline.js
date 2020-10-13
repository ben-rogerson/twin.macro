export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(outline)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('outline')
  if (!value) {
    errorSuggestions({ config: ['outline'] })
  }

  const [outline, outlineOffset = 0] = Array.isArray(value) ? value : [value]

  return {
    outline: `${outline}${important}`,
    ...(outlineOffset && { outlineOffset: `${outlineOffset}${important}` }),
  }
}
