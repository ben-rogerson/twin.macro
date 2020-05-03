import { addPxTo0 } from './../utils'

const stripNegativePrefix = string =>
  string && string.slice(0, 1) === '-' ? string.slice(1, string.length) : string

const handleOpacity = ({ configValue }) => {
  const opacity = configValue('divideOpacity') || configValue('opacity')
  if (!opacity) return

  return { '--divide-opacity': `${opacity}` }
}

const handleWidth = ({
  configValue,
  theme,
  pieces: { negative, className, important },
  errors: { errorNotFound },
}) => {
  const width = configValue('divideWidth')
  !width && errorNotFound({ config: theme('divideWidth') })

  const value = `${negative}${addPxTo0(width)}`
  const isDivideX = className.startsWith('divide-x')
  const cssVariableKey = isDivideX ? '--divide-x-reverse' : '--divide-y-reverse'

  const borderFirst = `calc(${value} * var(${cssVariableKey}))${important}`
  const borderSecond = `calc(${value} * calc(1 - var(${cssVariableKey})))${important}`

  const styleKey = isDivideX
    ? { borderRightWidth: borderFirst, borderLeftWidth: borderSecond }
    : { borderTopWidth: borderSecond, borderBottomWidth: borderFirst }

  const innerStyles = { [cssVariableKey]: 0, ...styleKey }

  return { '> :not(template) ~ :not(template)': innerStyles }
}

export default properties => {
  const {
    errors: { errorNotFound },
    getConfigValue,
    theme,
    match,
  } = properties

  const opacityMatch =
    match(/(?<=(divide)-(opacity))([^]*)/) || match(/^divide-opacity$/)
  const opacityValue = stripNegativePrefix(opacityMatch) || ''
  const opacityProperties = {
    configValue: config => getConfigValue(theme(config), opacityValue),
    ...properties,
  }

  const opacity = handleOpacity(opacityProperties)
  if (opacity) return opacity

  const widthMatch = match(/(?<=(divide)-(x|y))([^]*)/)
  const widthValue = stripNegativePrefix(widthMatch) || ''
  const widthProperties = {
    configValue: config => getConfigValue(theme(config), widthValue),
    ...properties,
  }

  const width = handleWidth(widthProperties)
  if (width) return width

  errorNotFound({
    config: {
      ...(theme('divideOpacity') || theme('opacity')),
      ...theme('divideWidth'),
    },
  })
}
