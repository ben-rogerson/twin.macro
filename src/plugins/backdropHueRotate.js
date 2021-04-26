export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    pieces: { negative },
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(backdrop-hue-rotate)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropHueRotate')
  if (!value) {
    errorSuggestions({ config: ['backdropHueRotate'] })
  }

  const backdrophueRotateValue = Array.isArray(value)
    ? value.map(v => `hue-rotate(${negative}${v})`).join(' ')
    : `hue-rotate(${negative}${value})`

  return { '--tw-backdrop-hue-rotate': backdrophueRotateValue }
}
