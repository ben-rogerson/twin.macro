export default value => {
  if (typeof value !== 'string') return value
  return value
    .replace(/:merge\((\S*?)\)/, '$1')
    .replace(/({{)|(}})/g, '')
    .trim()
}
