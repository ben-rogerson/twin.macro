import { isShortCss, isNumeric } from './utils'

/**
 * Split the negative from the className
 */
const splitNegative = ({ className }) => {
  const hasNegative = !isShortCss(className) && className.slice(0, 1) === '-'

  if (hasNegative) {
    className = className.slice(1, className.length)
  }

  const negative = hasNegative ? '-' : ''

  return { className, hasNegative, negative }
}

const maybeAddNegative = (value, negative) => {
  if (!negative) return value

  if (typeof value === 'string') {
    if (value.startsWith('-')) return value.slice(1)
    if (value.startsWith('var(')) return `calc(${value} * -1)`
  }

  if (isNumeric(value.slice(0, 1))) return `${negative}${value}`

  return value
}

export { splitNegative, maybeAddNegative }
