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

const parseRuleProperty = string => {
  if (string && string.match(/^--[a-z-]*$/i)) {
    return string
  }

  return camelize(string)
}

const buildAtSelector = (name, values, screens) => {
  // Support @screen selectors
  if (name === 'screen') {
    const screenValue = screens[values]
    if (screenValue) return `@media (min-width: ${screenValue})`
  }

  return `@${name} ${values}`
}

const getUserPluginRules = (rules, screens) =>
  rules.reduce((result, rule) => {
    // Build the media queries
    if (rule.type === 'atrule') {
      // Remove a bunch of nodes that tailwind uses for limiting rule generation
      // https://github.com/tailwindlabs/tailwindcss/commit/b69e46cc1b32608d779dad35121077b48089485d#diff-808341f38c6f7093a7979961a53f5922R20
      if (['layer', 'variants', 'responsive'].includes(rule.name)) {
        return deepMerge(result, ...getUserPluginRules(rule.nodes, screens))
      }

      const atSelector = buildAtSelector(rule.name, rule.params, screens)

      return deepMerge(result, {
        [atSelector]: getUserPluginRules(rule.nodes, screens),
      })
    }

    const selector = parseSelector(rule.selector)

    // Rule isn't formatted correctly
    if (selector === null) return null

    // Combine the children styles
    const values = rule.nodes.reduce(
      (result, rule) => ({
        ...result,
        [parseRuleProperty(rule.prop)]: rule.value,
      }),
      {}
    )

    // Separate comma separated selectors
    const separatedSelectors = selector.split(',').reduce(
      (r, i) => ({
        ...r,
        [i.replace(/\\\//g, '/').trim()]: values,
      }),
      {}
    )

    return deepMerge(result, separatedSelectors)
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
  const components = getUserPluginRules(
    processedPlugins.components,
    config.theme.screens
  )

  /**
   * Utilities
   */
  const utilities = getUserPluginRules(
    processedPlugins.utilities,
    config.theme.screens
  )

  return { components, utilities }
}

export default getUserPluginData
