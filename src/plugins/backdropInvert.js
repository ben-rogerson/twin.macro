export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(backdrop-invert)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropInvert')
  if (!value) {
    errorSuggestions({ config: ['backdropInvert'] })
  }

  const backdropInvertValue = Array.isArray(value)
    ? value.map(v => `invert(${v})`).join(' ')
    : `invert(${value})`
  return {
    '--tw-backdrop-invert': backdropInvertValue,
    backdropFilter: `var(--tw-backdrop-blur, blur(0)) var(--tw-backdrop-brightness, brightness(1)) var(--tw-backdrop-contrast, contrast(1)) var(--tw-backdrop-grayscale, grayscale(0)) var(--tw-backdrop-hue-rotate, hue-rotate(0deg)) var(--tw-backdrop-invert, invert(0)) var(--tw-backdrop-opacity, opacity(1)) var(--tw-backdrop-saturate, saturate(1)) var(--tw-backdrop-sepia, sepia(0))${important}`,
  }
}
