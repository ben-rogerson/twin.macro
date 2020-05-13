/**
 * Split the negative from the className
 */
const splitNegative = ({ className }) => {
  const hasNegative = className.slice(0, 1) === '-'
  if (hasNegative) {
    className = className.slice(1, className.length)
  }

  const negative = hasNegative ? '-' : ''

  return { className, hasNegative, negative }
}

export { splitNegative }
