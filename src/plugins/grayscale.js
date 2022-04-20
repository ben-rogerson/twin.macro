export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
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

  return {
    '--tw-grayscale': grayscaleValue,
    filter: `var(--tw-blur, blur(0)) var(--tw-brightness, brightness(1)) var(--tw-contrast, contrast(1)) var(--tw-grayscale, grayscale(0)) var(--tw-hue-rotate, hue-rotate(0deg)) var(--tw-invert, invert(0)) var(--tw-saturate, saturate(1)) var(--tw-sepia, sepia(0)) var(--tw-drop-shadow, drop-shadow(0 0 #0000))${important}`,
  }
}
