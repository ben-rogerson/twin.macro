import dlv from 'dlv'
import { addPxTo0 } from './../utils'

const stripNegativePrefix = string =>
  string.slice(0, 1) === '-' ? string.slice(1, string.length) : string

export default ({
  pieces: { negative, important, className },
  errors: { errorNotFound },
  theme,
}) => {
  const classNameMatch = className.match(/(?<=(divide)-(x|y))([^]*)/)
  const classNameValue = stripNegativePrefix(dlv(classNameMatch, [0]))

  const divideWidths = theme('divideWidth')
  const configValue = divideWidths[classNameValue || 'default']
  !configValue && errorNotFound({ config: divideWidths })

  const value = `${negative}${addPxTo0(configValue)}`
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
