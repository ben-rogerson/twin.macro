export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(animate)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const animationConfig = configValue('animation')

  if (!animationConfig) {
    errorSuggestions({ config: ['animation'] })
  }

  return {
    animation: `${animationConfig}${important}`,
  }
}

export const globalKeyframeStyles = ({ theme }) => {
  const keyframes = theme`keyframes`
  if (!keyframes) return

  const output = Object.entries(keyframes).reduce(
    (result, [name, frames]) => ({ ...result, [`@keyframes ${name}`]: frames }),
    {}
  )
  return output
}
