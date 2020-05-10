import { isEmpty, assert, stripNegative } from './misc'
import { logGeneralError } from './../logging'

const normalizeValue = value => {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  logGeneralError(
    `The config value "${Object.stringify(
      value
    )}" is unsupported - try a string, array or number`
  )
}

const matchChildKey = (from, matcher) => {
  if (!matcher) return

  for (const entry of Object.entries(from)) {
    const [key, value] = entry
    if (typeof value !== 'object') continue

    const splitMatcher = matcher.split(key)
    if (isEmpty(splitMatcher[1])) continue

    const match = stripNegative(splitMatcher[1])
    const objectMatch = value[match]
    if (isEmpty(objectMatch)) continue

    const isValueReturnable =
      typeof objectMatch === 'string' ||
      typeof objectMatch === 'number' ||
      Array.isArray(objectMatch)

    assert(!isValueReturnable, () =>
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
  if (isEmpty(matcher) && !isEmpty(from.default)) {
    return normalizeValue(from.default)
  }

  const match = from[matcher]
  if (
    typeof match === 'string' ||
    typeof match === 'number' ||
    Array.isArray(match)
  ) {
    return normalizeValue(match)
  }

  // Match default value from child object
  const defaultMatch = typeof match === 'object' && match.default
  if (defaultMatch) {
    return normalizeValue(defaultMatch)
  }

  const firstChildKey = matchChildKey(from, matcher)
  if (firstChildKey) return firstChildKey
}

export default getConfigValue
