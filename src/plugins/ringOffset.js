import { toColorValue } from './../utils'

const handleColor = ({ configValue }) => {
  const value = configValue('ringOffsetColor')
  if (!value) return

  return { '--tw-ring-offset-color': toColorValue(value) }
}

const handleWidth = ({ configValue }) => {
  const value = configValue('ringOffsetWidth')
  if (!value) return

  return { '--tw-ring-offset-width': value }
}

export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    errors: { errorSuggestions },
  } = properties

  const classValue = match(/(?<=(ring-offset)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  const width = handleWidth({ configValue })
  if (width) return width

  const color = handleColor({ configValue })
  if (color) return color

  errorSuggestions({
    config: ['ringOffsetWidth', 'ringOffsetColor'],
  })
}
