import { withAlpha } from './../utils'

const handleColor = ({ configValue, important }) => {
  const value = configValue('backgroundColor')
  if (!value) return

  return withAlpha({
    color: value,
    property: 'backgroundColor',
    variable: '--bg-opacity',
    important,
  })
}

const handleSize = ({ configValue, important }) => {
  const value = configValue('backgroundSize')
  if (!value) return

  return {
    backgroundSize: `${value}${important}`,
  }
}

const handlePosition = ({ configValue, important }) => {
  const value = configValue('backgroundPosition')
  if (!value) return

  return {
    backgroundPosition: `${value}${important}`,
  }
}

export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorNotFound },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(bg)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const color = handleColor({ configValue, important })
  if (color) return color

  const size = handleSize({ configValue, important })
  if (size) return size

  const position = handlePosition({ configValue, important })
  if (position) return position

  errorNotFound({
    config: {
      ...theme('backgroundColor'),
      ...theme('backgroundSize'),
      ...theme('backgroundPosition'),
    },
  })
}
