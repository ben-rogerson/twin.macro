import deepMerge from 'lodash.merge'
import camelize from './lib/util/camelize'
import replaceThemeValue from './lib/util/replaceThemeValue'
import sassifySelector from './lib/util/sassifySelector'
import {
  DEFAULTS_UNIVERSAL,
  COMMAS_OUTSIDE_BRACKETS,
  EMPTY_CSS_VARIABLE_VALUE,
  HANDLED_ATRULE_TYPES,
  LAYER_DEFAULTS,
} from './constants'

const transformImportant = (value, params) => {
  if (params.passChecks === true) return value
  if (!params.hasImportant) return value

  if (params.hasImportant && params.options.respectImportant === false)
    return null

  return `${value} !important`
}

const transformValueTasks = [replaceThemeValue, transformImportant]

const transformDeclValue = (value, params) => {
  const valueOriginal = value

  for (const task of transformValueTasks) {
    value = task(value, params)
  }

  if (value !== valueOriginal)
    params.debug('converted theme/important', {
      old: valueOriginal,
      new: value,
    })

  return value
}

const extractFromRule = (rule, params) => [
  rule.selector
    .replace(/\\3(\d)/g, '$1') // Remove digit escaping
    .replace(/\\2c /g, ',') // Remove comma escaping
    .replace(/\\(?=.|$)/g, '') // Remove \\ escaping
    .replace(/\n/g, ' '), //  Replace \n with a space
  extractRuleStyles(rule.nodes, params),
]

const extractSelectorFromAtRule = (name, value, params) => {
  if (name === LAYER_DEFAULTS) {
    if (params.processLayerDefaults === false) return
    return DEFAULTS_UNIVERSAL
  }

  if (name === 'screen') {
    const screenValue = params.screens[value]
    return screenValue && `@media (min-width: ${screenValue})`
  }

  return `@${name} ${value}`.trim()
}

const extractRuleStyles = (nodes, params) => {
  const styles = nodes
    .map(rule => {
      const handler = handledRuleTypes(rule.type)
      return handler ? handler(rule, params) : null
    })
    .filter(Boolean)
  if (styles.length === 0) return null
  return deepMerge(...styles)
}

const handledRuleTypes = type =>
  ({
    decl(decl, params) {
      const property = decl.prop.startsWith('--')
        ? decl.prop
        : camelize(decl.prop)

      const value =
        decl.prop.startsWith('--') && decl.value === ' '
          ? EMPTY_CSS_VARIABLE_VALUE // valid empty value in js, unlike ` `
          : transformDeclValue(decl.value, { ...params, decl, property })

      if (value === null) return

      return { [property]: value }
    },
    // General styles, eg: `{ display: block }`
    rule(rule, params) {
      if (!rule.selector) {
        if (rule.nodes) {
          const styles = extractRuleStyles(rule.nodes, params)
          params.debug('rule has no selector, returning nodes', styles)
          return styles
        }

        params.debug('no selector found in rule', rule, 'error')
        return
      }

      let [selector, styles] = extractFromRule(rule, params)

      if (selector && styles === null) return

      if (params.passChecks) {
        const out = selector ? { [selector]: styles } : styles
        params.debug('style pass return', out)
        return out
      }

      params.debug('styles extracted', [selector, styles])

      const selectorList = selector
        // Avoid split when comma is outside `()` + `[]`, eg: `:where(ul, ul)`
        .split(COMMAS_OUTSIDE_BRACKETS)
        .filter(s => params.selectorMatchReg.test(s))

      if (selectorList.length === 0) {
        params.debug('no selector match', selector, 'warn')
        return
      }

      if (selectorList.length === 1)
        params.debug('matched whole selector', selectorList[0])
      if (selectorList.length > 1)
        params.debug('matched multiple selectors', selectorList)

      selector = selectorList
        .map(s => sassifySelector(s, params))
        .filter(Boolean)
        .join(',')

      params.debug('sassified key', selectorList)

      if (!selector) return styles

      return { [selector]: styles }
    },

    // At-rules, eg: `@media __` && `@screen md`
    atrule(atrule, params) {
      const selector = extractSelectorFromAtRule(
        atrule.name,
        atrule.params,
        params
      )

      if (!selector) {
        params.debug(
          'no atrule selector found, removed',
          { name: atrule.name, params: atrule.params },
          'warn'
        )
        return
      }

      if (!HANDLED_ATRULE_TYPES.has(atrule.name)) {
        params.debug(`${atrule.name} pass given`, selector)
        // Rules that pass checks have no further style transformations
        params.passChecks = true
      }

      const styles = extractRuleStyles(atrule.nodes, params)
      if (!styles) return

      let ruleset = { [selector]: styles }

      if (selector === DEFAULTS_UNIVERSAL) {
        // Add a cloned backdrop style
        ruleset = { ...ruleset, '::backdrop': styles }
        params.debug('universal default', styles)
      }

      return ruleset
    },
  }[type])

export default extractRuleStyles
