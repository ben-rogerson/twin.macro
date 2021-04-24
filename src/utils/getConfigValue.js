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

const matchConfig = (from, matcher) => {
  if (!matcher) return

  for (const entry of Object.entries(from)) {
    const [key, value] = entry

    if (typeof value !== 'object') continue

    // Fixes https://github.com/ben-rogerson/twin.macro/issues/104
    if (!matcher.startsWith(key)) continue

    const newMatcher = matcher.slice(key.length)
    if (isEmpty(newMatcher) || !newMatcher.startsWith('-')) continue

    const match = stripNegative(newMatcher)
    const objectMatch = value[match]

    if (isEmpty(objectMatch)) {
      // Support infinite nesting in tailwind.config
      // Fixes https://github.com/ben-rogerson/twin.macro/issues/355
      return matchConfig(value, match)
    }

    const isValueReturnable =
      ['string', 'number', 'function'].includes(typeof objectMatch) ||
      Array.isArray(objectMatch)

    throwIf(!isValueReturnable, () =>
      logGeneralError(
        `The config value "${JSON.stringify(
          objectMatch
        )}" is unsupported - try a string, function, array, or number`
      )
    )

    return typeof objectMatch === 'function' ? objectMatch : String(objectMatch)
  }
}

/**
 * Searches the tailwindConfig
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

  const configMatch = matchConfig(from, matcher)
  if (configMatch) return configMatch
}

export default getConfigValue
