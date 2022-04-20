export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(sepia)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('sepia')
  if (!value) {
    errorSuggestions({ config: ['sepia'] })
  }

  const sepiaValue = Array.isArray(value)
    ? value.map(v => `sepia(${v})`).join(' ')
    : `sepia(${value})`

  return { '--tw-sepia': sepiaValue, filter: `var(--tw-blur, blur(0)) var(--tw-brightness, brightness(1)) var(--tw-contrast, contrast(1)) var(--tw-grayscale, grayscale(0)) var(--tw-hue-rotate, hue-rotate(0deg)) var(--tw-invert, invert(0)) var(--tw-saturate, saturate(1)) var(--tw-sepia, sepia(0)) var(--tw-drop-shadow, drop-shadow(0 0 #0000))${important}` }
}
