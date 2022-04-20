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
    filter: `var(--tw-blur, blur(0)) var(--tw-brightness, brightness(1)) var(--tw-contrast, contrast(1)) var(--tw-grayscale, grayscale(0)) var(--tw-hue-rotate, hue-rotate(0deg)) var(--tw-invert, invert(0)) var(--tw-saturate, saturate(1)) var(--tw-sepia, sepia(0)) var(--tw-drop-shadow, drop-shadow(0 0 #0000))${important}`,
  }
}
