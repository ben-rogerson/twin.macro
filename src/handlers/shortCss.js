import { throwIf, camelize, splitOnFirst } from '../utils'
import { logBadGood } from '../logging'
import { replaceThemeValue } from './helpers'

export default ({ className, theme }) => {
  let [property, value] = splitOnFirst(className, '[')

  property =
    (property.startsWith('--') && property) || // Retain css variables
    camelize(property)

  // Remove the last ']' and whitespace
  value = value.slice(0, -1).trim()

  throwIf(!property, () =>
    logBadGood(
      `“[${value}]” is missing the css property before the square brackets`,
      `Write it like this: marginTop[${value || '5rem'}]`
    )
  )

  const themeReplacedValue = replaceThemeValue(value, { theme })

  return { [property]: themeReplacedValue }
}
