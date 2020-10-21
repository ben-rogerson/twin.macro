import { withAlpha } from './../utils'

const handleColor = ({ configValue, important, disableColorVariables }) => {
  const value = configValue('backgroundColor')
  if (!value) return

  return withAlpha({
    color: value,
    property: 'backgroundColor',
    variable: !disableColorVariables && '--bg-opacity',
    important,
  })
}

const handleSize = ({ configValue, important }) => {
  const value = configValue('backgroundSize')
  if (!value) return

  return { backgroundSize: `${value}${important}` }
}

const handlePosition = ({ configValue, important }) => {
  const value = configValue('backgroundPosition')
  if (!value) return

  return { backgroundPosition: `${value}${important}` }
}

const handleImage = ({ configValue, important }) => {
  const value = configValue('backgroundImage')
  if (!value) return

  return { backgroundImage: `${value}${important}` }
}

export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    configTwin: { disableColorVariables },
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(bg)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const color = handleColor({
    configValue,
    important,
    disableColorVariables,
  })
  if (color) return color

  const size = handleSize({ configValue, important })
  if (size) return size

  const position = handlePosition({ configValue, important })
  if (position) return position

  const image = handleImage({ configValue, important })
  if (image) return image

  errorSuggestions({
    config: [
      'backgroundColor',
      'backgroundSize',
      'backgroundPosition',
      'backgroundImage',
    ],
  })
}
