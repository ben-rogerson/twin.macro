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

    return { ...result, ...newValue }
  }, {})

const reorderAtRules = className =>
  className &&
  Object.entries(className)
    .sort((a, b) => {
      const [aKey] = a
      const [bKey] = b
      const A = aKey.startsWith('@') ? 1 : 0
      const B = bKey.startsWith('@') ? 1 : 0
      return B > A ? -1 : 0
    })
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

const possibleClassNameSuffix = [' ', ':', '>', '~', '+', '*']

const getMatches = ({ className, data, sassyPseudo }) =>
  Object.entries(data).reduce((result, item) => {
    let [key, value] = item
    key = key.replace(/\\/g, '')

    const subKeyMatch = matchKeys(Object.entries(value), className, sassyPseudo)
    const newKey = formatKey(key, className, sassyPseudo)

    if (!isEmpty(subKeyMatch)) {
      return { ...result, [newKey]: subKeyMatch }
    }

    if (
      key === className ||
      possibleClassNameSuffix.some(suffix =>
        key.startsWith(`${className}${suffix}`)
      )
    ) {
      return newKey ? { ...result, [newKey]: value } : { ...result, ...value }
    }

    return result
  }, {})

const formatKey = (selector, className, sassyPseudo) => {
  const newSelector = selector.replace(className, '').trim()
  return (
    (newSelector.startsWith(':') && sassyPseudo && `&${newSelector}`) ||
    newSelector
  )
}

export default ({
  state: {
    configTwin: { sassyPseudo },
    userPluginData: { components, utilities },
  },
  className,
}) => {
  let result
  ;[components, utilities].find(data => {
    const matches = getMatches({ className, data, sassyPseudo })
    const hasMatches = !isEmpty(matches)
    result = hasMatches ? matches : result
    return hasMatches
  })
  return reorderAtRules(result)
}
