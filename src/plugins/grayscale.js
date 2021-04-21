export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(grayscale)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('grayscale')
  if (!value) {
    errorSuggestions({ config: ['grayscale'] })
  }

  const grayscaleValue = Array.isArray(value)
    ? value.map(v => `grayscale(${v})`).join(' ')
    : `grayscale(${value})`

  return { '--tw-grayscale': grayscaleValue }
}
