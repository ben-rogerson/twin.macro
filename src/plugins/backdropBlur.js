export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(backdrop-blur)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropBlur')
  if (!value) {
    errorSuggestions({ config: ['backdropBlur'] })
  }

  const backdropBlurValue = Array.isArray(value)
    ? value.map(v => `blur(${v})`).join(' ')
    : `blur(${value})`

  return { '--tw-backdrop-blur': backdropBlurValue }
}
