import dset from 'dset'
import processPlugins from 'tailwindcss/lib/util/processPlugins'

const parseSelector = selector => {
  if (selector.includes(','))
    throw new Error(`Only a single selector is supported: "${selector}"`)
  const matches = selector.trim().match(/^\.(\S+)(\s+.*?)?$/)
  if (matches === null) return
  return matches[1]
}

const camelize = string =>
  string.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())

const getComponentRules = rules =>
  rules.reduce((result, rule) => {
    const selector = parseSelector(rule.selector)
    if (selector === null) return null
    const values = rule.nodes.reduce(
      (result, rule) => ({
        ...result,
        [camelize(rule.prop)]: rule.value,
      }),
      {}
    )
    return {
      ...result,
      [selector]: values,
    }
  }, {})

const getComponentMatches = (className, componentRules) =>
  Object.entries(componentRules).filter(
    ([key]) => key === className || key.startsWith(`${className}:`)
  )

const formatComponentMatches = (matches, className) =>
  matches.reduce((result, match) => {
    const [key, value] = match
    const selector = key.replace(className, '')
    const style = selector ? { [selector]: value } : value
    return {
      ...result,
      ...style,
    }
  }, {})

export default ({ config, className }) => {
  if (!config.plugins || config.plugins.length === 0) {
    return
  }

  const processedPlugins = processPlugins(config.plugins, config)

  // TODO
  // const base = processedPlugins.base

  /**
   * Components
   */
  const componentRules = getComponentRules(processedPlugins.components)
  const componentMatches = getComponentMatches(className, componentRules)
  if (componentMatches.length > 0)
    return formatComponentMatches(componentMatches, className)

  /**
   * Utilities
   * TODO: Update to new functions as the components
   */
  const pluginClassNames = {}
  processedPlugins.utilities.forEach(rule => {
    if (rule.type !== 'atrule' || rule.name !== 'variants') {
      return
    }

    rule.each(x => {
      const name = parseSelector(x.selector)
      if (name === null) {
        return
      }

      dset(pluginClassNames, [name], {})
      x.walkDecls(decl => {
        dset(pluginClassNames, [name].concat(camelize(decl.prop)), decl.value)
      })
    })
  })
  const output =
    typeof pluginClassNames[className] !== 'undefined'
      ? pluginClassNames[className]
      : null

  return output
}
