import { addPxTo0, stripNegative } from './../utils'

const handleOpacity = ({ configValue }) => {
  const opacity = configValue('divideOpacity') || configValue('opacity')
  if (!opacity) return

  return {
    '> :not([hidden]) ~ :not([hidden])': {
      '--tw-divide-opacity': `${opacity}`,
    },
  }
}

const handleWidth = ({
  configValue,
  pieces: { negative, className, important },
}) => {
  const width = configValue('divideWidth')
  if (!width) return

  const value = `${negative}${addPxTo0(width)}`
  const isDivideX = className.startsWith('divide-x')
  const cssVariableKey = isDivideX
    ? '--tw-divide-x-reverse'
    : '--tw-divide-y-reverse'

  const borderFirst = `calc(${value} * var(${cssVariableKey}))${important}`
  const borderSecond = `calc(${value} * calc(1 - var(${cssVariableKey})))${important}`

  const styleKey = isDivideX
    ? { borderRightWidth: borderFirst, borderLeftWidth: borderSecond }
    : { borderTopWidth: borderSecond, borderBottomWidth: borderFirst }

  const innerStyles = { [cssVariableKey]: '0', ...styleKey }

  return { '> :not([hidden]) ~ :not([hidden])': innerStyles }
}

export default properties => {
  const {
    errors: { errorSuggestions },
    getConfigValue,
    getCoerced,
    theme,
    match,
  } = properties

  const coercedColor = getCoerced('color')
  if (coercedColor) return coercedColor

  const opacityMatch =
    match(/(?<=(divide)-(opacity))([^]*)/) ||
    (match(/^divide-opacity$/) && 'default')
  if (opacityMatch) {
    const opacityValue = stripNegative(opacityMatch) || ''
    const opacityProperties = {
      configValue: config => getConfigValue(theme(config), opacityValue),
      ...properties,
    }
    const opacity = handleOpacity(opacityProperties)
    if (opacity) return opacity

    errorSuggestions({
      config: theme('divideOpacity') ? 'divideOpacity' : 'opacity',
    })
  }

  const widthMatch =
    match(/(?<=(divide)-(x|y))([^]*)/) || (match(/^divide-(x|y)$/) && 'DEFAULT')
  if (widthMatch) {
    const widthValue = stripNegative(widthMatch) || ''
    const widthProperties = {
      configValue: config => getConfigValue(theme(config), widthValue),
      ...properties,
    }
    const width = handleWidth(widthProperties)
    if (width) return width

    errorSuggestions({ config: 'divideWidth' })
  }

  errorSuggestions()
}
