import { camelize, splitOnFirst } from '../utils'
import { replaceThemeValue } from './helpers'

export default ({ className, theme }) => {
  className = className.slice(1, -1) // Remove wrapping [ + ]
  let [property, rawValue] = splitOnFirst(className, ':')

  property =
    (property.startsWith('--') && property) || // Retain css variables
    camelize(property)

  const value = replaceThemeValue(rawValue, { theme }).replace(/_/g, ' ')

  return { [property]: value }
}
