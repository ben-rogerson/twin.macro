import { isEmpty } from './../utils'

const matchSubKeys = (values, className, sassyPseudo) =>
  values.reduce((result, data) => {
    const [key, value] = data

    const newKey = formatKey(key, className, sassyPseudo)

    const newValue =
      typeof value === 'object' &&
      (key === className || key.startsWith(`${className}:`)) &&
      (newKey ? { [newKey]: value } : value)

    return {
      ...result,
      ...newValue,
    }
  }, {})

const getComponentMatches = ({ className, components, sassyPseudo }) =>
  Object.entries(components).reduce((result, data) => {
    const [key, value] = data
    const subKeyMatch = matchSubKeys(
      Object.entries(value),
      className,
      sassyPseudo
    )
    const newKey = formatKey(key, className, sassyPseudo)

    if (!isEmpty(subKeyMatch)) {
      return { ...result, [newKey]: subKeyMatch }
    }

    if (key === className || key.startsWith(`${className}:`)) {
      return newKey ? { ...result, [newKey]: value } : { ...result, ...value }
    }

    return result
  }, {})

const formatKey = (selector, className, sassyPseudo) =>
  sassyPseudo && selector.startsWith && selector.startsWith(':')
    ? `&${selector.replace(className, '')}`
    : selector.replace(className, '')

export default ({
  state: {
    sassyPseudo,
    userPluginData: { components, utilities },
  },
  className,
}) => {
  /**
   * Components
   */
  if (components) {
    const componentMatches = getComponentMatches({
      className,
      components,
      sassyPseudo,
    })
    if (!isEmpty(componentMatches)) {
      return componentMatches
    }
  }

  /**
   * Utilities
   */
  if (!utilities) return

  const output =
    typeof utilities[className] !== 'undefined' ? utilities[className] : null

  return output
}
