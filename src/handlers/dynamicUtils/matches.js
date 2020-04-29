function matchString(value) {
  if (typeof value !== 'string') return
  return value
}

function matchNumberAsString(value) {
  if (typeof value !== 'number') return
  return String(value)
}

function matchDefaultValue(value) {
  if (typeof value !== 'object') return
  if (!value.default) return
  return value.default
}

function matchObject(value) {
  if (!value) return
  if (typeof value !== 'object') return
  return value
}

export { matchString, matchNumberAsString, matchDefaultValue, matchObject }
