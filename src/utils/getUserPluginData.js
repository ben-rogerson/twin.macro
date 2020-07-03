import dset from 'dset'
import processPlugins from 'tailwindcss/lib/util/processPlugins'
import deepMerge from 'lodash.merge'

const parseSelector = selector => {
  if (!selector) return
  const matches = selector.trim().match(/^(\S+)(\s+.*?)?$/)
  if (matches === null) return
  return matches[0].replace(/\./g, '')
}

const camelize = string =>
  string && string.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())

const buildAtSelector = (name, values, screens) => {
  // Support @screen selectors
  if (name === 'screen') {
    const screenValue = screens[values]
    if (screenValue) return `@media (min-width: ${screenValue})`
  }

  return `@${name} ${values}`
}

const getComponentRules = (rules, screens) =>
  rules.reduce((result, rule) => {
    // Rule is a media query
    if (rule.type === 'atrule') {
      const atSelector = buildAtSelector(rule.name, rule.params, screens)
      return deepMerge(result, {
        [atSelector]: getComponentRules(rule.nodes, screens),
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

    // Separate comma separated selectors
    const separatedSelectors = selector
      .split(',')
      .reduce((r, i) => ({ ...r, [i.trim()]: values }), {})

    return {
      ...result,
      ...separatedSelectors,
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
  const components = getComponentRules(
    processedPlugins.components,
    config.theme.screens
  )

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
