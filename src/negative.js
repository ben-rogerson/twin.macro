/**
 * Split the negative from the className
 */
const splitNegative = ({ className }) => {
  const isShortCss = className.includes('[')
  const hasNegative = !isShortCss && className.slice(0, 1) === '-'

  // TODO: Look in deprecating the negative prefix removal
  if (hasNegative) {
    className = className.slice(1, className.length)
  }

  const negative = hasNegative ? '-' : ''

  return { className, hasNegative, negative }
}

export { splitNegative }
