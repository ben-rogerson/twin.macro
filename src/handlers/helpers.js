import { throwIf, isNumeric } from '../utils'
import { logGeneralError } from '../logging'

// Arbitrary values with a theme value, eg: tw`h-[calc(100%-theme('spacing.16'))]`
const replaceThemeValue = (value, { theme }) => {
  const match = value.match(/theme\(["']?([^"']+)["']?\)/)
  if (!match) return value

  const themeFunction = match[0]
  const themeValue = theme(match[1])
  throwIf(!themeValue, () =>
    logGeneralError(`No theme value found for “${match[1]}”`)
  )

  return value.replace(themeFunction, themeValue)
}

const maybeAddNegative = (value, negative) => {
  if (!negative) return value

  if (typeof value === 'string') {
    if (value.startsWith('-')) return value.slice(1)
    if (value.startsWith('var(')) return `calc(${value} * -1)`
  }

  if (isNumeric(value)) return `${negative}${value}`

  return value
}

export { replaceThemeValue, maybeAddNegative }
