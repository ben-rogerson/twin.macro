export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(backdrop-contrast)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropContrast')
  if (!value) {
    errorSuggestions({ config: ['backdropContrast'] })
  }

  const backdropContrastValue = Array.isArray(value)
    ? value.map(v => `contrast(${v})`).join(' ')
    : `contrast(${value})`
  return {
    '--tw-backdrop-contrast': backdropContrastValue,
    backdropFilter: `var(--tw-backdrop-blur, blur(0)) var(--tw-backdrop-brightness, brightness(1)) var(--tw-backdrop-contrast, contrast(1)) var(--tw-backdrop-grayscale, grayscale(0)) var(--tw-backdrop-hue-rotate, hue-rotate(0deg)) var(--tw-backdrop-invert, invert(0)) var(--tw-backdrop-opacity, opacity(1)) var(--tw-backdrop-saturate, saturate(1)) var(--tw-backdrop-sepia, sepia(0))${important}`,
  }
}
