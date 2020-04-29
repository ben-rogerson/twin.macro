import dlv from 'dlv'
import { withAlpha } from './../utils'

const handleTextColor = ({ theme, match, pieces: { important } }) => {
  const themeTextColor = theme('textColor')

  const classNameValue = match(/(?<=(text-))([^]*)/)
  if (!classNameValue) return

  const value =
    dlv(themeTextColor, classNameValue) ||
    dlv(themeTextColor, classNameValue.replace(/-/g, '.'))
  if (!value) return

  return withAlpha({
    color: `${value}`,
    property: 'color',
    variable: '--text-opacity',
    important,
  })
}

const handleFontSize = ({ theme, match }) => {
  const themeFontSize = theme('fontSize')
  const classNameValue = match(/(?<=(text-))([^]*)/)
  if (!classNameValue) return

  const value = dlv(themeFontSize, classNameValue)
  if (!value) return

  const [fontSize, lineHeight] = Array.isArray(value) ? value : [value]

  return {
    fontSize,
    ...(lineHeight && {
      lineHeight,
    }),
  }
}

export default properties => {
  const colorStyle = handleTextColor(properties)
  if (colorStyle) return colorStyle

  const fontStyle = handleFontSize(properties)
  if (!fontStyle) {
    const {
      theme,
      errors: { errorNotFound },
    } = properties
    errorNotFound({ config: { ...theme('textColor'), ...theme('fontSize') } })
  }

  return fontStyle
}
