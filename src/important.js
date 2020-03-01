/**
 * Add important to a value
 */
const mergeImportant = (obj, hasImportant) => {
  if (!hasImportant) return obj
  return Object.entries(obj).reduce((acc, item) => {
    const [key, value] = item
    if (typeof value === 'object') {
      return mergeImportant(value, hasImportant)
    }
    return { ...acc, [key]: `${value} !important` }
  }, {})
}

/**
 * Split the important from the className
 */
const splitImportant = ({ className, ...rest }) => {
  const lastCharacter = className.substr(className.length - 1)
  const hasImportant = lastCharacter === '!'
  if (hasImportant) {
    className = className.slice(0, className.length - 1)
  }
  return { ...rest, className, hasImportant }
}

export { splitImportant, mergeImportant }
