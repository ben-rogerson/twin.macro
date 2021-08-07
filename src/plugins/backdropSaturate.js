export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(backdrop-saturate)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const value = configValue('backdropSaturate')
  if (!value) {
    errorSuggestions({ config: ['backdropSaturate'] })
  }

  const backdropSaturateValue = Array.isArray(value)
    ? value.map(v => `saturate(${v})`).join(' ')
    : `saturate(${value})`
  return {
    '--tw-backdrop-saturate': backdropSaturateValue,
    backdropFilter: `var(--tw-backdrop-filter)${important}`,
  }
}
