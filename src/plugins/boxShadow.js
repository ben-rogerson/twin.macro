export const globalBoxShadowStyles = {
  '*': { '--tw-shadow': '0 0 #0000' },
}

export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(shadow)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)
  const value = configValue('boxShadow')

  if (!value) {
    return errorSuggestions({ config: 'boxShadow' })
  }

  return {
    '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
    boxShadow: `${[
      `var(--tw-ring-offset-shadow, 0 0 #0000)`,
      `var(--tw-ring-shadow, 0 0 #0000)`,
      `var(--tw-shadow)`,
    ].join(', ')}${important}`,
  }
}
