import { makeBoxShadow } from './../boxShadow'

export const globalBoxShadowStyles = {
  '*, ::before, ::after': {
    '--tw-shadow': '0 0 #0000',
    '--tw-shadow-colored': '0 0 #0000',
  },
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

  return makeBoxShadow(value, important)
}
