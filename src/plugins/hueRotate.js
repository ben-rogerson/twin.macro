export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    pieces: { negative, important },
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(hue-rotate)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('hueRotate')
  if (!value) {
    errorSuggestions({ config: ['hueRotate'] })
  }

  const hueRotateValue = Array.isArray(value)
    ? value.map(v => `hue-rotate(${negative}${v})`).join(' ')
    : `hue-rotate(${negative}${value})`

  return {
    '--tw-hue-rotate': hueRotateValue,
    filter: `var(--tw-filter)${important}`,
  }
}
