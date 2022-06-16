import deepMerge from 'lodash.merge'
import buildPluginApi from './pluginApi'
import { formatCssProperty, isClass } from '../utils'
import {
  LAYER_BASE,
  LAYER_COMPONENTS,
  LAYER_UTILITIES,
  SELECTOR_ALL,
} from '../constants'

const stripLeadingDot = string =>
  string.startsWith('.') ? string.slice(1) : string

const replaceSelectorWithParent = (string, replacement) =>
  string.replace(replacement, `{{${stripLeadingDot(replacement)}}}`)

const isMediaQuery = str => str.startsWith('@media')

const parseSelector = selector => {
  if (!selector) return

  const matches = selector.trim().match(/^(\S+)(\s+.*?)?$/)
  if (matches === null) return
  let match = escapeSelector(matches[0]).trim()

  // Single selector then return
  // Avoid matching spaces within parentheses, eg: `:where(ul, ol)`
  const hasSpace = / (?=(((?!\)).)*\()|[^()]*$)/.test(match)
  const hasSelectorInParentheses = /\.\w+(?!(((?!\)).)*\()|[^()]*$)/.test(match)
  const hasClasses = (match.match(/\./g) || []).length
  if (!hasSpace && !hasSelectorInParentheses && hasClasses < 2) return match

  // Look for class matching candidates
  const match2 = match.match(
    /(?<=\w|>|^|~|\+|\*| |\()\.[\w\\-]+(?:\.\d)?(?=\.| |>|~|\+|\*|:|$|\))/gm
  )
  if (!match2) return match

  // Wrap the matching classes in {{class}}
  for (const item of match2) {
    if (!isClass(item) || isMediaQuery(item)) return match
    match = replaceSelectorWithParent(match, item)
  }

  return escapeSelector(match).trim()
}

const escapeSelector = selector => selector.replace(/\\\//g, '/')

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
  const selector = selectorParsed.join(', ')
  if (!selector) return null

  // Base values stay as-is because they aren't interactive
  if (isBase) return { [selector]: buildDeclaration(rule.nodes) }

  return Object.fromEntries(
    selector
      // Separate comma-separated selectors to allow twin's features.
      // But avoid splitting if the comma is within parentheses, eg:
      // :where(ul ul, ul ol, ol ul, ol ol) (from official typography plugin)
      .split(/,(?=(?:(?:(?!\)).)*\()|[^()]*$)/g)
      .map(selector => [selector, buildDeclaration(rule.nodes)])
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

const sortScreenOrder = (a, b, screenOrder) => {
  const screenIndexA = a.name === 'screen' ? screenOrder.indexOf(a.params) : 0
  const screenIndexB = b.name === 'screen' ? screenOrder.indexOf(b.params) : 0
  return screenIndexA - screenIndexB
}

const sortMediaRules = (a, b) => {
  const atRuleA = a.type === 'atrule' ? 1 : 0
  const atRuleB = b.type === 'atrule' ? 1 : 0
  return atRuleA - atRuleB
}

const ruleSorter = (arr, screens) => {
  if (!Array.isArray(arr) || arr.length === 0) return []

  const screenOrder = screens ? Object.keys(screens) : []

  arr
    // Place at rules at the end '@media' etc
    .sort(sortMediaRules)
    // Sort @media by screens index
    .sort((a, b) => sortScreenOrder(a, b, screenOrder))
    // Traverse children and reorder aswell
    // eslint-disable-next-line unicorn/no-array-for-each
    .forEach(item => {
      if (!item.nodes || item.nodes.length === 0) return
      // eslint-disable-next-line unicorn/no-array-for-each
      item.nodes.forEach(i => {
        if (typeof i !== 'object') return

        return ruleSorter(i, screens)
      })
    })

  return arr
}

const getUserPluginRules = (rules, screens, isBase) => {
  const sortedRules = ruleSorter(rules, screens)
  const ruleList = sortedRules.map(rule => {
    if (typeof rule === 'function') return rule()
    if (rule.type === 'decl') return { [rule.prop]: rule.value }
    if (rule.type !== 'atrule') return getBuiltRules(rule, { isBase })
    // Remove a bunch of nodes that tailwind uses for limiting rule generation
    // https://github.com/tailwindlabs/tailwindcss/commit/b69e46cc1b32608d779dad35121077b48089485d#diff-808341f38c6f7093a7979961a53f5922R20
    if (['layer', 'variants', 'responsive'].includes(rule.name))
      return getUserPluginRules(rule.nodes, screens, isBase)
    const atSelector = buildAtSelector(rule.name, rule.params, screens)
    return { [atSelector]: getUserPluginRules(rule.nodes, screens, isBase) }
  })

  return deepMerge(...ruleList)
}

const getUserPluginData = ({ config, configTwin }) => {
  if (!config.plugins || config.plugins.length === 0) return

  const context = {
    candidateRuleMap: new Map(),
    variants: new Map(),
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

  const baseRaw = []
  const componentsRaw = []
  const utilitiesRaw = []

  for (const [keyname, rules] of context.candidateRuleMap) {
    for (const [data, rule] of rules) {
      if (data.layer === LAYER_BASE || keyname === SELECTOR_ALL) {
        baseRaw.push(rule)
      }

      if (data.layer === LAYER_COMPONENTS && keyname !== SELECTOR_ALL) {
        componentsRaw.push(rule)
      }

      if (data.layer === LAYER_UTILITIES && keyname !== SELECTOR_ALL) {
        utilitiesRaw.push(rule)
      }
    }
  }

  return {
    base: getUserPluginRules(baseRaw, config.theme.screens, true),
    components: getUserPluginRules(componentsRaw, config.theme.screens),
    utilities: getUserPluginRules(utilitiesRaw, config.theme.screens),
    variants: context.variants,
  }
}

export default getUserPluginData
