export default string => {
  if (typeof string !== 'string') return string
  return string
    .replace(/:merge\((\S*?)\)/, '$1')
    .replace(/({{)|(}})/g, '')
    .trim()
}
