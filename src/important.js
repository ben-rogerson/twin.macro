// Add important
const mergeImportant = (input, hasImportant) => {
  if (!hasImportant) return input
  return Object.entries(input).reduce((acc, item) => {
    const [key, value] = item
    if (hasImportant) {
      if (typeof value === 'object') {
        return mergeImportant(value, hasImportant)
      }
      return { ...acc, [key]: `${value} !important` }
    }
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
