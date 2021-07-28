const handleColor = ({ toColor }) => {
  const common = {
    matchStart: 'placeholder',
    property: 'color',
    configSearch: 'placeholderColor',
  }
  return toColor([
    { ...common, opacityVariable: '--tw-placeholder-opacity' },
    common,
  ])
}

const handleOpacity = ({ configValue }) => {
  const value = configValue('placeholderOpacity') || configValue('opacity')
  if (!value) return

  return { '--tw-placeholder-opacity': `${value}` }
}

export default properties => {
  const {
    match,
    theme,
    toColor,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const opacityMatch =
    match(/(?<=(placeholder-opacity-))([^]*)/) || match(/^placeholder-opacity$/)
  const opacity = handleOpacity({
    configValue: config => getConfigValue(theme(config), opacityMatch),
  })
  if (opacity) return { '::placeholder': opacity }

  const color = handleColor({ toColor })
  if (color) return { '::placeholder': color }

  errorSuggestions({
    config: [
      'placeholderColor',
      theme('placeholderOpacity') ? 'placeholderOpacity' : 'opacity',
    ],
  })
}
