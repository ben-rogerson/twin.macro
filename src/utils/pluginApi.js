/* eslint-disable prefer-object-spread, @typescript-eslint/restrict-plus-operands */
import postcss from 'postcss'
import deepMerge from 'lodash.merge'
import dlv from 'dlv'
import selectorParser from 'postcss-selector-parser'
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue'
import parseObjectStyles from 'tailwindcss/lib/util/parseObjectStyles'
import isPlainObject from 'tailwindcss/lib/util/isPlainObject'
import { toPath } from 'tailwindcss/lib/util/toPath'
import { throwIf, toArray, formatCssProperty } from './index'
import { getUnsupportedError } from '../logging'

const matchPlugin = (rules, options, { layer, context, prefixIdentifier }) => {
  const defaultOptions = {
    respectPrefix: true,
    respectImportant: layer === 'utilities',
  }

  options = { ...defaultOptions, ...options }

  for (const [identifier] of Object.entries(rules)) {
    const prefixedIdentifier = prefixIdentifier(identifier, options)
    const rule = rules[identifier]

    // eslint-disable-next-line no-inner-declarations
    function wrapped() {
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

const asPlugin = (rules, options, { layer, context, prefixIdentifier }) => {
  const defaultOptions = {
    respectPrefix: true,
    respectImportant: layer === 'utilities',
  }

  options = Object.assign(
    {},
    defaultOptions,
    Array.isArray(options) ? {} : options
  )

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

  const { allowUnsupportedPlugins } = context.configTwin

  return {
    addVariant() {
      throwIf(!allowUnsupportedPlugins, () =>
        getUnsupportedError('addVariant()')
      )
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
          .push([{ layer: 'base' }, rule])
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
        layer: 'components',
        prefixIdentifier,
        context,
      }),
    matchComponents: (components, options) =>
      matchPlugin(components, options, {
        layer: 'components',
        prefixIdentifier,
        context,
      }),
    addUtilities: (utilities, options) =>
      asPlugin(utilities, options, {
        layer: 'utilities',
        prefixIdentifier,
        context,
      }),
    matchUtilities: (utilities, options) =>
      matchPlugin(utilities, options, {
        layer: 'utilities',
        prefixIdentifier,
        context,
      }),
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
