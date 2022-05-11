import buildPluginApi from './pluginApi'
import deepMerge from 'lodash.merge'
import { formatCssProperty } from './../utils'

const stripLeadingDot = string =>
  string.startsWith('.') ? string.slice(1) : string

const replaceSelectorWithParent = (string, replacement) =>
  string.replace(replacement, `{{${stripLeadingDot(replacement)}}}`)

const parseSelector = selector => {
  if (!selector) return

  const matches = selector.trim().match(/^(\S+)(\s+.*?)?$/)
  if (matches === null) return

  let match = matches[0]

  // Fix spacing that goes missing when provided by tailwindcss
  // Unfortunately this removes the ability to have classes on the same element
  // eg: .something.something or &.something
  match = match.replace(/(?<=\w)\./g, ' .')

  // If the selector is just a single selector then return
  if (!match.includes(' ')) return match

  // Look for class matching candidates
  const match2 = match.match(
    /(?<=>|^|~|\+|\*| )\.[\w.\\-]+(?= |>|~|\+|\*|:|$)/gm
  )

  if (!match2) return match
  // Wrap the matching classes in {{class}}
  for (const item of match2) {
    match = replaceSelectorWithParent(match, item)
  }

  return match
}

const escapeSelector = selector => selector.replace(/\\\//g, '/').trim()

const buildAtSelector = (name, values, screens) => {
  // Support @screen selectors
  if (name === 'screen') {
    const screenValue = screens[values]
    if (screenValue) return `@media (min-width: ${screenValue})`
  }

  return `@${name} ${values}`
}

const getBuiltRules = (rule, { isBase }) => {
  if (!rule.selector) return null
  // Prep comma spaced selectors for parsing
  const selectorArray = rule.selector.split(',')

  // Validate each selector
  const selectorParsed = selectorArray
    .map(s => parseSelector(s))
    .filter(Boolean)

  // Join them back into a string
  const selector = selectorParsed.join(',')

  // Rule isn't formatted correctly
  if (!selector) return null

  if (isBase) {
    // Base values stay as-is because they aren't interactive
    return { [escapeSelector(selector)]: buildDeclaration(rule.nodes) }
  }

  // Separate comma-separated selectors to allow twin's features
  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/prefer-object-from-entries
  return selector.split(',').reduce(
    (result, selector) => ({
      ...result,
      [escapeSelector(selector)]: buildDeclaration(rule.nodes),
    }),
    {}
  )
}

const buildDeclaration = items => {
  if (typeof items !== 'object') return items
  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/prefer-object-from-entries
  return Object.entries(items).reduce(
    (result, [, declaration]) => ({
      ...result,
      [formatCssProperty(declaration.prop)]: declaration.value,
    }),
    {}
  )
}

const sortLength = (a, b) => {
  const selectorA = a.selector ? a.selector.length : 0
  const selectorB = b.selector ? b.selector.length : 0
  return selectorA - selectorB
}

const sortScreenOrder = (a, b, screenOrder) => {
  const screenIndexA = a.name === 'screen' ? screenOrder.indexOf(a.params) : 0
  const screenIndexB = b.name === 'screen' ? screenOrder.indexOf(b.params) : 0
  return screenIndexA - screenIndexB
}

const sortMediaRulesFirst = (a, b) => {
  const atRuleA = a.type === 'atrule' ? 1 : 0
  const atRuleB = b.type === 'atrule' ? 1 : 0
  return atRuleA - atRuleB
}

const ruleSorter = (arr, screens) => {
  if (!Array.isArray(arr) || arr.length === 0) return []

  const screenOrder = screens ? Object.keys(screens) : []

  arr
    // Tailwind also messes up the ordering so classes need to be resorted
    // Order selectors by length (don't know of a better way)
    .sort(sortLength)
    // Place at rules at the end '@media' etc
    .sort(sortMediaRulesFirst)
    // Sort @media by screens index
    .sort((a, b) => sortScreenOrder(a, b, screenOrder))
    // Traverse children and reorder aswell
    // FIXME: Remove comment and fix next line
    // eslint-disable-next-line unicorn/no-array-for-each
    .forEach(item => {
      if (!item.nodes || item.nodes.length === 0) return
      // FIXME: Remove comment and fix next line
      // eslint-disable-next-line unicorn/no-array-for-each
      item.nodes.forEach(i => {
        if (typeof i !== 'object') return

        return ruleSorter(i, screens)
      })
    })

  return arr
}

const getUserPluginRules = (rules, screens, isBase) =>
  ruleSorter(rules, screens).reduce((result, rule) => {
    if (typeof rule === 'function') {
      return deepMerge(result, rule())
    }

    if (rule.type === 'decl') {
      const builtRules = { [rule.prop]: rule.value }
      return deepMerge(result, builtRules)
    }

    // Build the media queries
    if (rule.type !== 'atrule') {
      const builtRules = getBuiltRules(rule, { isBase })
      return deepMerge(result, builtRules)
    }

    // Remove a bunch of nodes that tailwind uses for limiting rule generation
    // https://github.com/tailwindlabs/tailwindcss/commit/b69e46cc1b32608d779dad35121077b48089485d#diff-808341f38c6f7093a7979961a53f5922R20
    if (['layer', 'variants', 'responsive'].includes(rule.name)) {
      return deepMerge(
        result,
        ...getUserPluginRules(rule.nodes, screens, isBase)
      )
    }

    const atSelector = buildAtSelector(rule.name, rule.params, screens)

    return deepMerge(result, {
      [atSelector]: getUserPluginRules(rule.nodes, screens, isBase),
    })
  }, {})

const getUserPluginData = ({ config, configTwin }) => {
  if (!config.plugins || config.plugins.length === 0) {
    return
  }

  const context = {
    candidateRuleMap: new Map(),
    tailwindConfig: config,
    configTwin,
  }

  const pluginApi = buildPluginApi(config, context)

  const userPlugins = config.plugins.map(plugin => {
    if (plugin.__isOptionsFunction) {
      plugin = plugin()
    }

    return typeof plugin === 'function' ? plugin : plugin.handler
  })

  // Call each of the plugins with the pluginApi
  for (const plugin of userPlugins) {
    if (Array.isArray(plugin)) {
      for (const pluginItem of plugin) {
        pluginItem(pluginApi)
      }
    } else {
      plugin(pluginApi)
    }
  }

  const rulesets = context.candidateRuleMap.values()

  const baseRaw = []
  const componentsRaw = []
  const utilitiesRaw = []

  // eslint-disable-next-line unicorn/prefer-spread
  for (const rules of Array.from(rulesets)) {
    for (const [data, rule] of rules) {
      if (data.layer === 'base') {
        baseRaw.push(rule)
      }

      if (data.layer === 'components') {
        componentsRaw.push(rule)
      }

      if (data.layer === 'utilities') {
        utilitiesRaw.push(rule)
      }
    }
  }

  /**
   * Variants
   */
  // No support for Tailwind's addVariant() function

  /**
   * Base
   */
  const base = getUserPluginRules(baseRaw, config.theme.screens, true)

  /**
   * Components
   */
  const components = getUserPluginRules(componentsRaw, config.theme.screens)

  /**
   * Utilities
   */
  const utilities = getUserPluginRules(utilitiesRaw, config.theme.screens)

  return { base, components, utilities }
}

export default getUserPluginData
