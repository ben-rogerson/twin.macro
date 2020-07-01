import dset from 'dset'
import processPlugins from 'tailwindcss/lib/util/processPlugins'
import deepMerge from 'lodash.merge'

const parseSelector = selector => {
  if (!selector) return
  if (selector.includes(','))
    throw new Error(`Only a single selector is supported: "${selector}"`)
  const matches = selector.trim().match(/^\.(\S+)(\s+.*?)?$/)
  if (matches === null) return
  return matches[1]
}

const camelize = string =>
  string && string.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())

const getComponentRules = rules =>
  rules.reduce((result, rule) => {
    // Rule is a media query
    if (rule.type === 'atrule') {
      return deepMerge(result, {
        [`@${rule.name} ${rule.params}`]: getComponentRules(rule.nodes),
      })
    }

    const selector = parseSelector(rule.selector)

    // Rule isn't formatted correctly
    if (selector === null) return null

    // Combine the chilren styles
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

const getUserPluginData = ({ config }) => {
  if (!config.plugins || config.plugins.length === 0) {
    return
  }

  // Use Tailwind (using PostCss) to process the plugin data
  const processedPlugins = processPlugins(config.plugins, config)

  /**
   * Variants
   */
  // No support for Tailwind's addVariant() function

  /**
   * Components
   */
  const components = getComponentRules(processedPlugins.components)

  /**
   * Utilities
   * TODO: Convert this to a reduce like getComponentRules
   */
  const utilities = {}
  processedPlugins.utilities.forEach(rule => {
    if (rule.type !== 'atrule' || rule.name !== 'variants') {
      return
    }

    rule.each(x => {
      const name = parseSelector(x.selector)
      if (name === null) {
        return
      }

      dset(utilities, [name], {})
      x.walkDecls(decl => {
        dset(utilities, [name].concat(camelize(decl.prop)), decl.value)
      })
    })
  })

  return { components, utilities }
}

export default getUserPluginData
