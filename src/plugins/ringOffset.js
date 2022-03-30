export default properties => {
  const {
    getCoerced,
    matchConfigValue,
    errors: { errorSuggestions },
    pieces: { negative },
  } = properties

  const width = matchConfigValue('ringOffsetWidth', /(?<=(ring-offset)-)([^]*)/)
  if (width) return { '--tw-ring-offset-width': `${negative}${width}` }

  const coercedColor = getCoerced('color')
  if (coercedColor) return coercedColor

  errorSuggestions({
    config: ['ringOffsetWidth', 'ringOffsetColor'],
  })
}
