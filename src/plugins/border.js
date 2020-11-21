import { withAlpha } from './../utils'

const handleWidth = ({ configValue, important }) => {
  const value = configValue('borderWidth')
  if (!value) return

  return {
    borderWidth: `${value}${important}`,
  }
}

const handleColor = ({ configValue, important, disableColorVariables }) => {
  const value = configValue('borderColor')

  if (!value) return
  return withAlpha({
    color: value,
    property: 'borderColor',
    variable: !disableColorVariables && '--tw-border-opacity',
    important,
  })
}

export default properties => {
  const {
    match,
    theme,
    getConfigValue,
    configTwin: { disableColorVariables },
    pieces: { important },
    errors: { errorSuggestions },
  } = properties
  const classValue = match(/(?<=(border-))([^]*)/)

  const configValue = config => getConfigValue(theme(config), classValue)

  const width = handleWidth({ configValue, important })
  if (width) return width

  const color = handleColor({ configValue, important, disableColorVariables })
  if (color) return color

  errorSuggestions({ config: ['borderColor', 'borderWidth'] })
}
