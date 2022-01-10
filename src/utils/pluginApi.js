/* eslint-disable guard-for-in, prefer-const, prefer-object-spread, object-shorthand, no-inner-declarations, @typescript-eslint/restrict-plus-operands */

import postcss from 'postcss'
import dlv from 'dlv'
import selectorParser from 'postcss-selector-parser'
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue'
import parseObjectStyles from 'tailwindcss/lib/util/parseObjectStyles'
import isPlainObject from 'tailwindcss/lib/util/isPlainObject'
import nameClass from 'tailwindcss/lib/util/nameClass'
import { coerceValue } from 'tailwindcss/lib/util/pluginUtils'
import { toPath } from 'tailwindcss/lib/util/toPath'
import log from 'tailwindcss/lib/util/log'
import isValidArbitraryValue from 'tailwindcss/lib/util/isValidArbitraryValue'

export default function buildPluginApi(tailwindConfig, context) {
  function getConfigValue(path, defaultValue) {
    return path ? dlv(tailwindConfig, path, defaultValue) : tailwindConfig
  }

  function prefixIdentifier(identifier, options) {
    if (identifier === '*') {
      return '*'
    }

    if (!options.respectPrefix) {
      return identifier
    }

    return context.tailwindConfig.prefix + identifier
  }

  return {
    addVariant() {
      // Unavailable in twin
      return null
    },
    postcss,
    prefix: prefix => prefix, // Customised
    e: className => className.replace(/\./g, '\\.'),
    config: getConfigValue,
    theme(path, defaultValue) {
      const [pathRoot, ...subPaths] = toPath(path)
      const value = getConfigValue(
        ['theme', pathRoot, ...subPaths],
        defaultValue
      )
      return transformThemeValue(pathRoot)(value)
    },
    corePlugins: path => {
      if (Array.isArray(tailwindConfig.corePlugins)) {
        return tailwindConfig.corePlugins.includes(path)
      }

      return getConfigValue(['corePlugins', path], true)
    },
    variants: () => {
      // Preserved for backwards compatibility but not used in v3.0+
      return []
    },
    addUserCss(userCss) {
      for (let [identifier, rule] of withIdentifiers(userCss)) {
        if (!context.candidateRuleMap.has(identifier)) {
          context.candidateRuleMap.set(identifier, [])
        }

        context.candidateRuleMap.get(identifier).push([{ layer: 'user' }, rule])
      }
    },
    addBase(base) {
      for (let [identifier, rule] of withIdentifiers(base)) {
        let prefixedIdentifier = prefixIdentifier(identifier, {})

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ layer: 'base' }, rule])
      }
    },
    addDefaults() {
      // Unavailable in twin
      return null
    },
    addComponents(components, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: false,
      }

      options = Object.assign(
        {},
        defaultOptions,
        Array.isArray(options) ? {} : options
      )

      for (let [identifier, rule] of withIdentifiers(components)) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ layer: 'components', options }, rule])
      }
    },
    addUtilities(utilities, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: true,
      }

      options = Object.assign(
        {},
        defaultOptions,
        Array.isArray(options) ? {} : options
      )

      for (let [identifier, rule] of withIdentifiers(utilities)) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap
          .get(prefixedIdentifier)
          .push([{ layer: 'utilities', options }, rule])
      }
    },
    matchUtilities: function (utilities, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: true,
      }

      options = { ...defaultOptions, ...options }

      for (let identifier in utilities) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let rule = utilities[identifier]

        function wrapped(modifier, { isOnlyPlugin }) {
          let { type = 'any' } = options
          type = [].concat(type)
          let [value, coercedType] = coerceValue(
            type,
            modifier,
            options,
            tailwindConfig
          )

          if (value === undefined) {
            return []
          }

          if (!type.includes(coercedType) && !isOnlyPlugin) {
            return []
          }

          if (!isValidArbitraryValue(value)) {
            return []
          }

          let ruleSets = []
            .concat(rule(value))
            .filter(Boolean)
            .map(declaration => ({
              [nameClass(identifier, modifier)]: declaration,
            }))

          return ruleSets
        }

        let withOffsets = [{ layer: 'utilities', options }, wrapped]

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets)
      }
    },
    matchComponents: function (components, options) {
      let defaultOptions = {
        respectPrefix: true,
        respectImportant: false,
      }

      options = { ...defaultOptions, ...options }

      for (let identifier in components) {
        let prefixedIdentifier = prefixIdentifier(identifier, options)
        let rule = components[identifier]

        function wrapped(modifier, { isOnlyPlugin }) {
          let { type = 'any' } = options
          type = [].concat(type)
          let [value, coercedType] = coerceValue(
            type,
            modifier,
            options,
            tailwindConfig
          )

          if (value === undefined) {
            return []
          }

          if (!type.includes(coercedType)) {
            if (isOnlyPlugin) {
              log.warn([
                `Unnecessary typehint \`${coercedType}\` in \`${identifier}-${modifier}\`.`,
                `You can safely update it to \`${identifier}-${modifier.replace(
                  coercedType + ':',
                  ''
                )}\`.`,
              ])
            } else {
              return []
            }
          }

          if (!isValidArbitraryValue(value)) {
            return []
          }

          let ruleSets = []
            .concat(rule(value))
            .filter(Boolean)
            .map(declaration => ({
              [nameClass(identifier, modifier)]: declaration,
            }))

          return ruleSets
        }

        let withOffsets = [{ layer: 'components', options }, wrapped]

        if (!context.candidateRuleMap.has(prefixedIdentifier)) {
          context.candidateRuleMap.set(prefixedIdentifier, [])
        }

        context.candidateRuleMap.get(prefixedIdentifier).push(withOffsets)
      }
    },
  }
}

function withIdentifiers(styles) {
  return parseStyles(styles).flatMap(node => {
    const nodeMap = new Map()
    const candidates = extractCandidates(node)

    // If this isn't "on-demandable", assign it a universal candidate.
    if (candidates.length === 0) {
      return [['*', node]]
    }

    return candidates.map(c => {
      if (!nodeMap.has(node)) {
        nodeMap.set(node, node)
      }

      return [c, nodeMap.get(node)]
    })
  })
}

function extractCandidates(node) {
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

function getClasses(selector) {
  const parser = selectorParser(selectors => {
    const allClasses = []
    selectors.walkClasses(classNode => {
      allClasses.push(classNode.value)
    })
    return allClasses
  })
  return parser.transformSync(selector)
}

function parseStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseStyles([styles])
  }

  return styles.flatMap(style => {
    const isNode = !Array.isArray(style) && !isPlainObject(style)
    return isNode ? style : parseObjectStyles(style)
  })
}
