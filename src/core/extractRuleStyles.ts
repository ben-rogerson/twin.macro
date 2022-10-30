import camelize from './lib/util/camelize'
import deepMerge from './lib/util/deepMerge'
import get from './lib/util/get'
import replaceThemeValue from './lib/util/replaceThemeValue'
import sassifySelector from './lib/util/sassifySelector'
import { splitAtTopLevelOnly, unescape } from './lib/util/twImports'
import {
  DEFAULTS_UNIVERSAL,
  EMPTY_CSS_VARIABLE_VALUE,
  PRESERVED_ATRULE_TYPES,
  LAYER_DEFAULTS,
  LINEFEED,
} from './constants'
import type { ExtractRuleStyles, CssObject, TransformDecl } from './types'
import type * as P from 'postcss'

const ESC_COMMA = /\\2c/g
const ESC_DIGIT = /\\3(\d)/g
const UNDERSCORE_ESCAPING = /\\+(_)/g
const BACKSLASH_ESCAPING = /\\\\/g

function transformImportant(value: string, params: TransformDecl): string {
  if (params.passChecks === true) return value
  if (!params.hasImportant) return value

  // Avoid adding important if the rule doesn't respect it
  if (params.hasImportant && params.options?.respectImportant === false)
    return value

  return `${value} !important`
}

function transformEscaping(value: string): string {
  return (
    value
      .replace(UNDERSCORE_ESCAPING, '$1')
      // Fix the duplicate escaping babel delivers
      .replace(BACKSLASH_ESCAPING, '\\')
  )
}

const transformValueTasks = [
  replaceThemeValue,
  transformImportant,
  transformEscaping,
]

function transformDeclValue(value: string, params: TransformDecl): string {
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

function extractFromRule(
  rule: P.Rule,
  params: ExtractRuleStyles
): [string, CssObject] {
  const selectorForUnescape = rule.selector.replace(ESC_DIGIT, '$1') // Remove digit escaping
  const selector = unescape(selectorForUnescape).replace(LINEFEED, ' ')

  return [selector, extractRuleStyles(rule.nodes, params)] as [
    string,
    CssObject
  ]
}

function extractSelectorFromAtRule(
  name: string,
  value: string,
  params: ExtractRuleStyles
): string | undefined {
  if (name === LAYER_DEFAULTS) {
    if (params.includeUniversalStyles === false) return
    return DEFAULTS_UNIVERSAL
  }

  const val = value.replace(ESC_COMMA, ',')

  // Handle @screen usage in plugins, eg: `@screen md`
  if (name === 'screen') {
    const screenConfig = get(params, 'tailwindConfig.theme.screens') as Record<
      string,
      string
    >
    return `@media (min-width: ${screenConfig[val]})`
  }

  return `@${name} ${val}`.trim()
}

const ruleTypes = {
  decl(decl: P.Declaration, params: ExtractRuleStyles): CssObject | undefined {
    const property = decl.prop.startsWith('--')
      ? decl.prop
      : camelize(decl.prop)

    const value =
      decl.prop.startsWith('--') && decl.value === ' '
        ? EMPTY_CSS_VARIABLE_VALUE // valid empty value in js, unlike ` `
        : transformDeclValue(decl.value, { ...params, decl, property })

    if (value === null) return

    // `background-clip: text` is still in "unofficial" phase and needs a
    // prefix in Firefox, Chrome and Safari.
    // https://caniuse.com/background-img-opts
    if (
      property === 'backgroundClip' &&
      (value === 'text' || value === 'text !important')
    )
      return {
        WebkitBackgroundClip: value,
        [property]: value,
      }

    return { [property]: value }
  },
  // General styles, eg: `{ display: block }`
  rule(rule: P.Rule, params: ExtractRuleStyles): CssObject | undefined {
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

    params.debug('styles extracted', { selector, styles })

    // As classes aren't used in css-in-js we split the selector into
    // multiple selectors and strip the ones that don't affect the current
    // element, eg: In `.this, .sub`, .sub is stripped as it has no target
    const selectorList = [...splitAtTopLevelOnly(selector, ',')].filter(s => {
      // Match the selector as a class
      const result = params.selectorMatchReg?.test(s)
      // Only keep selectors if they contain a `&` || aren’t
      // targeting multiple elements with classes
      if (!result && (s.includes('&') || !s.includes('.'))) return true
      return result
    })

    if (selectorList.length === 0) {
      params.debug('no selector match', selector, 'warn')
      return
    }

    if (selectorList.length === 1)
      params.debug('matched whole selector', selectorList[0])
    if (selectorList.length > 1)
      params.debug('matched multiple selectors', selectorList)

    selector = selectorList
      .map(s =>
        sassifySelector(
          s,
          params as ExtractRuleStyles & {
            selectorMatchReg: RegExp
            sassyPseudo: boolean
          }
        )
      )
      .filter(Boolean)
      .join(',')

    params.debug('sassified key', selector || styles)

    if (!selector) return styles

    return { [selector]: styles }
  },

  // At-rules, eg: `@media __` && `@screen md`
  atrule(atrule: P.AtRule, params: ExtractRuleStyles): CssObject | undefined {
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

    if (PRESERVED_ATRULE_TYPES.has(atrule.name)) {
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

    params.debug('atrule', selector)
    return ruleset
  },
}

type Styles = CssObject | undefined

function extractRuleStyles(nodes: P.Node[], params: ExtractRuleStyles): Styles {
  const styles: Styles[] = nodes
    .map((rule): CssObject | undefined => {
      const handler = ruleTypes[rule.type as keyof typeof ruleTypes]
      if (!handler) return

      return handler(rule as never, params)
    })
    .filter(Boolean)
  if (styles.length === 0) return undefined

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return deepMerge(styles[0], ...styles.slice(1))
}

export default extractRuleStyles
