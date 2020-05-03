import { withAlpha } from './../utils'

const handleColor = ({ configValue, important }) => {
  const value = configValue('placeholderColor')
  if (!value) return

  return withAlpha({
    color: value,
    property: 'color',
    variable: '--placeholder-opacity',
    important,
  })
}

const handleOpacity = ({ configValue }) => {
  const value = configValue('placeholderOpacity') || configValue('opacity')
  if (!value) return

  return { '--placeholder-opacity': `${value}` }
}

export default properties => {
  const {
    match,
    theme,
    getConfigValue,
    pieces: { important },
    errors: { errorNotFound },
  } = properties

  const opacityMatch =
    match(/(?<=(placeholder-opacity-))([^]*)/) || match(/^placeholder-opacity$/)
  const opacity = handleOpacity({
    configValue: config => getConfigValue(theme(config), opacityMatch),
  })
  if (opacity) return { '::placeholder': opacity }

  const colorMatch = match(/(?<=(placeholder-))([^]*)/)
  const color = handleColor({
    configValue: config => getConfigValue(theme(config), colorMatch),
    important,
  })
  if (color) return { '::placeholder': color }

  errorNotFound({
    config: {
      ...theme('placeholderColor'),
      ...(theme('placeholderOpacity') || theme('opacity')),
    },
  })
}
