import { isEmpty } from './../utils'

const matchKeys = (values, className, sassyPseudo) =>
  values.reduce((result, data) => {
    const [key, value] = data

    const newKey = formatKey(key, className, sassyPseudo)

    const newValue =
      typeof value === 'object' &&
      (key === className ||
        key.startsWith(`${className}:`) ||
        key.startsWith(`${className} `)) &&
      (newKey ? { [newKey]: value } : value)

    return {
      ...result,
      ...newValue,
    }
  }, {})

const reorderAtRules = className =>
  Object.entries(className)
    .sort((a, b) => {
      const [aKey] = a
      const [bKey] = b
      const A = aKey.startsWith('@') ? 1 : 0
      const B = bKey.startsWith('@') ? 1 : 0
      return B > A ? -1 : 0
    })
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

const getComponentMatches = ({ className, components, sassyPseudo }) =>
  Object.entries(components).reduce((result, data) => {
    const [key, value] = data
    const subKeyMatch = matchKeys(Object.entries(value), className, sassyPseudo)
    const newKey = formatKey(key, className, sassyPseudo)

    if (!isEmpty(subKeyMatch)) {
      return { ...result, [newKey]: subKeyMatch }
    }

    if (
      key === className ||
      key.startsWith(`${className}:`) ||
      key.startsWith(`${className} `)
    ) {
      return newKey ? { ...result, [newKey]: value } : { ...result, ...value }
    }

    return result
  }, {})

const formatKey = (selector, className, sassyPseudo) => {
  const newSelector = selector.replace(className, '').trim()
  return newSelector.startsWith(':')
    ? `${sassyPseudo ? '&' : ''}${newSelector}`
    : newSelector
}

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
      return reorderAtRules(componentMatches)
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
