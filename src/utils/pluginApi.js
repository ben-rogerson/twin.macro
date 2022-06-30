import postcss from 'postcss'
import deepMerge from 'lodash.merge'
import dlv from 'dlv'
import selectorParser from 'postcss-selector-parser'
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue'
import parseObjectStyles from 'tailwindcss/lib/util/parseObjectStyles'
import isPlainObject from 'tailwindcss/lib/util/isPlainObject'
import { toPath } from 'tailwindcss/lib/util/toPath'
import { throwIf, toArray, formatCssProperty } from './index'
import { getUnsupportedError, logGeneralError } from '../logging'
import {
  LAYER_BASE,
  LAYER_COMPONENTS,
  LAYER_UTILITIES,
  SELECTOR_ALL,
} from '../constants'

const MATCH_VARIANT = Symbol('match variant')

export default function buildPluginApi(tailwindConfig, context) {
  const getConfigValue = (path, defaultValue) =>
    path ? dlv(tailwindConfig, path, defaultValue) : tailwindConfig

  const prefixIdentifier = (identifier, options) => {
    if (identifier === SELECTOR_ALL) return identifier
    if (!options.respectPrefix) return identifier
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return context.tailwindConfig.prefix + identifier
  }

  const { allowUnsupportedPlugins } = context.configTwin

  const api = {
    addVariant(variantName, variantFunctions) {
      // eslint-disable-next-line unicorn/prefer-spread
      variantFunctions = [].concat(variantFunctions).map(variantFunction => {
        if (typeof variantFunction !== 'string')
          return ({
            args,
            modifySelectors,
            container,
            separator,
            wrap,
            format,
          }) => {
            const extraParams = variantFunction[MATCH_VARIANT] && {
              args,
              wrap,
              format,
            }
            let result = variantFunction({
              modifySelectors,
              container,
              separator,
              ...extraParams,
            })

            throwIf(
              typeof result === 'string' && !isValidVariantFormatString(result),
              () =>
                logGeneralError(
                  `\`${variantName}\` isn’t a valid at-rule or doesn’t contain a \`&\` placeholder`
                )
            )

            if (!context.configTwin.sassyPseudo) {
              result = stripSassyPseudo(result)
            }

            return result
          }

        throwIf(!isValidVariantFormatString(variantFunction), () =>
          logGeneralError(
            `\`${variantName}\` isn’t a valid at-rule or doesn’t contain a \`&\` placeholder`
          )
        )

        if (!context.configTwin.sassyPseudo) {
          variantFunction = stripSassyPseudo(variantFunction)
        }

        return variantFunction
      })

      context.variants.set(variantName, variantFunctions)
    },
    matchVariant(variants, options) {
      for (const variant of variants) {
        for (const [k, v] of Object.entries(options?.values || {})) {
          api.addVariant(`${variant}-${k}`, variants[variant](v))
        }

        api.addVariant(
          variant,
          Object.assign(({ args }) => variants[variant](args), {
            [MATCH_VARIANT]: true,
          })
        )
      }
    },
    postcss,
    prefix: prefix => prefix,
    e: e => e.replace(/\./g, '\\.'),
    config: getConfigValue,
    theme(path, defaultValue) {
      const [pathRoot, ...subPaths] = toPath(path)
      const value = getConfigValue(
        ['theme', pathRoot, ...subPaths],
        defaultValue
      )
      return transformThemeValue(pathRoot)(value)
    },
    corePlugins() {
      throwIf(!allowUnsupportedPlugins, () =>
        getUnsupportedError('corePlugins()')
      )
      return null
    },
    variants() {
      // Preserved for backwards compatibility but not used in v3.0+
      return []
    },
    addUserCss() {
      throwIf(!allowUnsupportedPlugins, () =>
        getUnsupportedError('addUserCss()')
      )
      return null
    },
    addBase(base) {
      for (const [identifier, rule] of withIdentifiers(base)) {
        const prefixedIdentifier = prefixIdentifier(identifier, {})

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ layer: LAYER_BASE }, rule])
      }
    },
    addDefaults() {
      throwIf(!allowUnsupportedPlugins, () =>
        getUnsupportedError('addDefaults()')
      )
      return null
    },
    addComponents: (components, options) =>
      asPlugin(components, options, {
        layer: LAYER_COMPONENTS,
        prefixIdentifier,
        context,
      }),
    matchComponents: (components, options) =>
      matchPlugin(components, options, {
        layer: LAYER_COMPONENTS,
        prefixIdentifier,
        context,
      }),
    addUtilities: (utilities, options) =>
      asPlugin(utilities, options, {
        layer: LAYER_UTILITIES,
        prefixIdentifier,
        context,
      }),
    matchUtilities: (utilities, options) =>
      matchPlugin(utilities, options, {
        layer: LAYER_UTILITIES,
        prefixIdentifier,
        context,
      }),
  }

  return api
}

const matchPlugin = (rules, options, { layer, context, prefixIdentifier }) => {
  const defaultOptions = {
    respectPrefix: true,
    respectImportant: layer === LAYER_UTILITIES,
  }

  options = { ...defaultOptions, ...options }

  for (const [identifier] of Object.entries(rules)) {
    const prefixedIdentifier = prefixIdentifier(identifier, options)
    const rule = rules[identifier]

    const wrapped = () => {
      const value = []
      for (const configValue of Object.values(options.values)) {
        const result = toArray(rule(configValue)).map(val => ({
          [['.', prefixedIdentifier, '-', configValue].join('')]:
            // eslint-disable-next-line unicorn/prefer-object-from-entries
            Object.entries(val).reduce(
              (result, [prop, value]) => ({
                ...result,
                [typeof value === 'string' ? formatCssProperty(prop) : prop]:
                  value,
              }),
              {}
            ),
        }))

        value.push(deepMerge({}, ...result))
      }

      if (value === undefined) return {}

      return deepMerge({}, ...value)
    }

    const withOffsets = [{ layer, options }, wrapped]

    if (!context.candidateRuleMap.has(prefixedIdentifier)) {
      context.candidateRuleMap.set(prefixedIdentifier, [])
    }

    context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets)
  }
}

function stripSassyPseudo(string) {
  if (typeof string !== 'string') return
  return string
    .split(',')
    .map(v => v.replace(/(?<=^ *)&/, '').trim())
    .join(', ')
}

const asPlugin = (rules, options, { layer, context, prefixIdentifier }) => {
  const defaultOptions = {
    respectPrefix: true,
    respectImportant: layer === LAYER_UTILITIES,
  }

  options = { ...defaultOptions, ...(Array.isArray(options) ? {} : options) }

  for (const [identifier, rule] of withIdentifiers(rules)) {
    const prefixedIdentifier = prefixIdentifier(identifier, options)

    if (!context.candidateRuleMap.has(prefixedIdentifier)) {
      context.candidateRuleMap.set(prefixedIdentifier, [])
    }

    context.candidateRuleMap
      .get(prefixedIdentifier)
      .push([{ layer, options }, rule])
  }
}

const isValidVariantFormatString = format =>
  format.startsWith('@') || format.includes('&')

const withIdentifiers = styles =>
  parseStyles(styles).flatMap(node => {
    const nodeMap = new Map()
    const candidates = extractCandidates(node)

    // If this isn't "on-demandable", assign it a universal candidate.
    if (candidates.length === 0) {
      return [[SELECTOR_ALL, node]]
    }

    return candidates.map(c => {
      if (!nodeMap.has(node)) {
        nodeMap.set(node, node)
      }

      return [c, nodeMap.get(node)]
    })
  })

const extractCandidates = node => {
  let classes = []

  if (node.type === 'rule') {
    for (const selector of node.selectors) {
      const classCandidates = getClasses(selector)
      // At least one of the selectors contains non-"on-demandable" candidates.
      if (classCandidates.length === 0) return []

      classes = [...classes, ...classCandidates]
    }

    return classes
  }

  if (node.type === 'atrule') {
    node.walkRules(rule => {
      classes = [
        ...classes,
        ...rule.selectors.flatMap(selector => getClasses(selector)),
      ]
    })
  }

  return classes
}

const getClasses = selector => {
  const parser = selectorParser(selectors => {
    const allClasses = []
    selectors.walkClasses(classNode => {
      allClasses.push(classNode.value)
    })
    return allClasses
  })
  return parser.transformSync(selector)
}

const parseStyles = styles => {
  if (!Array.isArray(styles)) return parseStyles([styles])

  return styles.flatMap(style => {
    const isNode = !Array.isArray(style) && !isPlainObject(style)
    return isNode ? style : parseObjectStyles(style)
  })
}
