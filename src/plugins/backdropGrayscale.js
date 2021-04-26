export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(backdrop-grayscale)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropGrayscale')
  if (!value) {
    errorSuggestions({ config: ['backdropGrayscale'] })
  }

  const backdropGrayscaleValue = Array.isArray(value)
    ? value.map(v => `grayscale(${v})`).join(' ')
    : `grayscale(${value})`
  return { '--tw-backdrop-grayscale': backdropGrayscaleValue }
}
