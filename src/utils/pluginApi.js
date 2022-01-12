/* eslint-disable prefer-const, prefer-object-spread, @typescript-eslint/restrict-plus-operands */
import postcss from 'postcss'
import dlv from 'dlv'
import selectorParser from 'postcss-selector-parser'
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue'
import parseObjectStyles from 'tailwindcss/lib/util/parseObjectStyles'
import isPlainObject from 'tailwindcss/lib/util/isPlainObject'
import { toPath } from 'tailwindcss/lib/util/toPath'

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
    corePlugins: () => null, // Unavailable in twin
    variants: () => {
      // Preserved for backwards compatibility but not used in v3.0+
      return []
    },
    addUserCss() {
      // Unavailable in twin
      return null
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
    matchUtilities: () => null, // Unavailable in twin
    matchComponents: () => null, // Unavailable in twin
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
