export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(brightness)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('brightness')
  if (!value) {
    errorSuggestions({ config: ['brightness'] })
  }

  const brightnessValue = Array.isArray(value)
    ? value.map(v => `brightness(${v})`).join(' ')
    : `brightness(${value})`

  return {
    '--tw-brightness': brightnessValue,
    filter: `var(--tw-blur, blur(0)) var(--tw-brightness, brightness(1)) var(--tw-contrast, contrast(1)) var(--tw-grayscale, grayscale(0)) var(--tw-hue-rotate, hue-rotate(0deg)) var(--tw-invert, invert(0)) var(--tw-saturate, saturate(1)) var(--tw-sepia, sepia(0)) var(--tw-drop-shadow, drop-shadow(0 0 #0000))${important}`,
  }
}
