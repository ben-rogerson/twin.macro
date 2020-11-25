export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties
  const classValue = match(/(?<=(transition)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const transitionProperty = configValue('transitionProperty')
  !transitionProperty && errorSuggestions({ config: 'transitionProperty' })

  if (transitionProperty === 'none') {
    return { transitionProperty: `${transitionProperty}${important}` }
  }

  const defaultTimingFunction = theme('transitionTimingFunction.DEFAULT')
  const defaultDuration = theme('transitionDuration.DEFAULT')

  return {
    transitionProperty: `${transitionProperty}${important}`,
    ...(defaultTimingFunction && {
      transitionTimingFunction: `${defaultTimingFunction}${important}`,
    }),
    ...(defaultDuration && {
      transitionDuration: `${defaultDuration}${important}`,
    }),
  }
}
