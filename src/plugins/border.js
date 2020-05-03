import { withAlpha } from './../utils'

const handleColor = ({ configValue, important }) => {
  const value = configValue('borderColor')
  if (!value) return

  return withAlpha({
    color: value,
    property: 'borderColor',
    variable: '--border-opacity',
    important,
  })
}

const handleWidth = ({ configValue, important }) => {
  const value = configValue('borderWidth')
  if (!value) return

  return {
    borderWidth: `${value}${important}`,
  }
}

export default properties => {
  const {
    match,
    theme,
    getConfigValue,
    pieces: { important },
    errors: { errorNotFound },
  } = properties

  const classValue = match(/(?<=(border-))([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const color = handleColor({ configValue, important })
  if (color) return color

  const width = handleWidth({ configValue, important })
  if (width) return width

  errorNotFound({
    config: {
      ...theme('borderColor'),
      ...theme('borderWidth'),
    },
  })
}
