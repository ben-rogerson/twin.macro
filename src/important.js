/**
 * Add important to a value
 */
const mergeImportant = (object, hasImportant) => {
  if (!hasImportant) return object
  return Object.entries(object).reduce((accumulator, item) => {
    const [key, value] = item
    if (typeof value === 'object') {
      return mergeImportant(value, hasImportant)
    }

    return { ...accumulator, [key]: `${value} !important` }
  }, {})
}

/**
 * Split the important from the className
 */
const splitImportant = ({ className, ...rest }) => {
  const lastCharacter = className.slice(-1)
  const hasImportant = lastCharacter === '!'
  if (hasImportant) {
    className = className.slice(0, -1)
  }

  return { ...rest, className, hasImportant }
}

export { splitImportant, mergeImportant }
