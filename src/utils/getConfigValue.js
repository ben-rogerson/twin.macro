import { isEmpty, throwIf, stripNegative } from './misc'
import { logGeneralError } from './../logging'

const normalizeValue = value => {
  if (['string', 'function'].includes(typeof value) || Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  logGeneralError(
    `The config value "${Object.stringify(
      value
    )}" is unsupported - try a string, function, array, or number`
  )
}

const matchChildKey = (from, matcher) => {
  if (!matcher) return
  for (const entry of Object.entries(from)) {
    const [key, value] = entry

    if (typeof value !== 'object') continue

    // Fixes https://github.com/ben-rogerson/twin.macro/issues/104
    if (!matcher.startsWith(key)) continue

    const splitMatcher = matcher.split(key)
    if (isEmpty(splitMatcher[1]) || !splitMatcher[1].startsWith('-')) continue

    const match = stripNegative(splitMatcher[1])
    const objectMatch = value[match]
    if (isEmpty(objectMatch)) continue

    const isValueReturnable =
      typeof objectMatch === 'string' ||
      typeof objectMatch === 'number' ||
      Array.isArray(objectMatch)

    throwIf(!isValueReturnable, () =>
      logGeneralError(
        `The tailwind config is nested too deep\nReplace this with a string, number or array:\n${JSON.stringify(
          objectMatch
        )}`
      )
    )

    return String(objectMatch)
  }
}

/**
 * Searches the tailwindConfig
 * Maximum of two levels deep
 */
const getConfigValue = (from, matcher) => {
  if (!from) return

  // Match default value from current object
  if (isEmpty(matcher) && !isEmpty(from.DEFAULT)) {
    return normalizeValue(from.DEFAULT)
  }

  const match = from[matcher]
  if (
    ['string', 'number', 'function'].includes(typeof match) ||
    Array.isArray(match)
  ) {
    return normalizeValue(match)
  }

  // Match default value from child object
  const defaultMatch = typeof match === 'object' && match.DEFAULT
  if (defaultMatch) {
    return normalizeValue(defaultMatch)
  }

  const firstChildKey = matchChildKey(from, matcher)
  if (firstChildKey) return firstChildKey
}

export default getConfigValue
