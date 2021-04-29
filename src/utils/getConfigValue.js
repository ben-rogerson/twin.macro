import { isEmpty } from './misc'
import { logGeneralError } from './../logging'

const normalizeValue = value => {
  if (['string', 'function'].includes(typeof value) || Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  logGeneralError(
    `The config value "${JSON.stringify(
      value
    )}" is unsupported - try a string, function, array, or number`
  )
}

const splitAtDash = (twClass, fromEnd = 1) => {
  const splitClass = twClass.split('-')
  return {
    firstPart: splitClass.slice(0, fromEnd * -1).join('-'),
    lastPart: splitClass.slice(fromEnd * -1).join('-'),
  }
}

/**
 * Searches the tailwindConfig
 */
const getConfigValue = (from, matcher) => {
  if (!from) return

  // Match default value from current object
  if (isEmpty(matcher)) {
    if (isEmpty(from.DEFAULT)) return
    return normalizeValue(from.DEFAULT)
  }

  // Match exact
  const match = from[matcher]
  if (
    ['string', 'number', 'function'].includes(typeof match) ||
    Array.isArray(match)
  ) {
    return normalizeValue(match)
  }

  // Match a default value from child object
  const defaultMatch = typeof match === 'object' && match.DEFAULT
  if (defaultMatch) {
    return normalizeValue(defaultMatch)
  }

  // A weird loop is used below so the return busts out of the parent
  let index = 1
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  for (const i of matcher.split('-')) {
    const { firstPart, lastPart } = splitAtDash(matcher, index)
    const objectMatch = from[firstPart]
    if (objectMatch && typeof objectMatch === 'object') {
      return getConfigValue(objectMatch, lastPart)
    }

    index = index + 1
  }
}

export default getConfigValue
