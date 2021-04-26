export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(backdrop-brightness)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropBrightness')
  if (!value) {
    errorSuggestions({ config: ['backdropBrightness'] })
  }

  const backdropBrightnessValue = Array.isArray(value)
    ? value.map(v => `brightness(${v})`).join(' ')
    : `brightness(${value})`
  return { '--tw-backdrop-brightness': backdropBrightnessValue }
}
