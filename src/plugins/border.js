const borderWidthConfig = [
  {
    property: 'borderTopWidth',
    value: regex => regex(/(?<=(border-t(-|$)))([^]*)/),
  },
  {
    property: 'borderRightWidth',
    value: regex => regex(/(?<=(border-r(-|$)))([^]*)/),
  },
  {
    property: 'borderBottomWidth',
    value: regex => regex(/(?<=(border-b(-|$)))([^]*)/),
  },
  {
    property: 'borderLeftWidth',
    value: regex => regex(/(?<=(border-l(-|$)))([^]*)/),
  },
  {
    property: 'borderWidth',
    value: regex => regex(/(?<=(border(-|$)))([^]*)/),
  },
]

const borderColorConfig = [
  { matchStart: 'border-t', property: 'borderTopColor' },
  { matchStart: 'border-r', property: 'borderRightColor' },
  { matchStart: 'border-b', property: 'borderBottomColor' },
  { matchStart: 'border-l', property: 'borderLeftColor' },
  { matchStart: 'border', property: 'borderColor' },
]

const getCommonColorConfig = ({ matchStart, property }) => ({
  matchStart,
  property,
  configSearch: 'borderColor',
})

export default properties => {
  const {
    matchConfigValue,
    toColor,
    pieces: { important },
    errors: { errorSuggestions },
  } = properties

  const getBorderWidthByRegex = regex => matchConfigValue('borderWidth', regex)
  for (const task of borderWidthConfig) {
    const value = task.value(getBorderWidthByRegex)
    if (value) return { [task.property]: `${value}${important}` }
  }

  for (const task of borderColorConfig) {
    const common = getCommonColorConfig(task)
    const value = toColor([
      { ...common, opacityVariable: '--tw-border-opacity' },
      common,
    ])
    if (value) return value
  }

  errorSuggestions({ config: ['borderColor', 'borderWidth'] })
}
