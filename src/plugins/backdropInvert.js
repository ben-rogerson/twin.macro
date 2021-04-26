export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(backdrop-invert)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropInvert')
  if (!value) {
    errorSuggestions({ config: ['backdropInvert'] })
  }

  const backdropInvertValue = Array.isArray(value)
    ? value.map(v => `invert(${v})`).join(' ')
    : `invert(${value})`
  return { '--tw-backdrop-invert': backdropInvertValue }
}
