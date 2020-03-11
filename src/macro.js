import { createMacro, MacroError } from 'babel-plugin-macros'
import { resolve, relative, dirname } from 'path'
import { existsSync } from 'fs'
import findIdentifier from './findIdentifier'
import parseTte from './parseTte'
import addImport from './addImport'
import getStyles from './getStyles'
import { orderByScreens } from './screens'
import astify from './astify'
import replaceWithLocation from './replaceWithLocation'
import resolveConfig from 'tailwindcss/lib/util/resolveConfig'
import processPlugins from 'tailwindcss/lib/util/processPlugins'
import prefixSelector from 'tailwindcss/lib/util/prefixSelector'
import buildMediaQuery from 'tailwindcss/lib/util/buildMediaQuery'
import cloneNodes from 'tailwindcss/lib/util/cloneNodes'
import buildSelectorVariant from 'tailwindcss/lib/util/buildSelectorVariant'
import escapeClassName from 'tailwindcss/lib/util/escapeClassName'
import corePlugins from 'tailwindcss/lib/corePlugins'
import substituteTailwindAtRules from 'tailwindcss/lib/lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from 'tailwindcss/lib/lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from 'tailwindcss/lib/lib/substituteVariantsAtRules'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub'
import postcssJs from 'postcss-js'
import selectorParser from 'postcss-selector-parser'
import postcss from 'postcss'

// const UTILS_IMPORT_FILEPATH = 'twin.macro/utils.umd'
const TW_CONFIG_DEFAULT_FILENAME = 'tailwind.config.js'

export default createMacro(twinMacro, { configName: 'twin' })

function processTailwindPlugins(getConfig) {
  // TODO: clarify re-evaluation strategy on config change
  let processedPlugins
  return function getProcessedPlugins() {
    if (!processedPlugins) {
      const config = getConfig()
      processedPlugins = processPlugins(
        [...corePlugins(config), ...config.plugins],
        config
      )
    }

    return processedPlugins
  }
}

function partiallyProcessTailwindFeatures(getConfig, getProcessedPlugins) {
  return function(css) {
    const config = getConfig()
    const processedPlugins = getProcessedPlugins()
    // const processedPlugins = processPlugins([...corePlugins({ corePlugins: ['fontWeight', 'fontSize', 'fontStyle', 'textColor', 'backgroundColor'] }), ...config.plugins], config)

    return postcss([
      substituteTailwindAtRules(config, processedPlugins),
      evaluateTailwindFunctions(config)
    ]).process(css)
  }
}

// https://github.com/tailwindcss/tailwindcss/blob/af36c6849e3668df0216c3e05bbde3b0921bbac5/src/lib/substituteClassApplyAtRules.js#L30-L32
function normalizeClassName(className) {
  return `.${escapeClassName(className.replace(/^\./, ''))}`
}

function walkToUtilty(css, selector) {
  let match
  css.walkRules(rule => {
    // if (rule.selector.includes('placeholder') && selector.includes('placeholder')) {
    //   console.log(rule.selector)
    // }
    if (
      !match &&
      classValueForSelector(rule.selector) === classValueForSelector(selector)
    ) {
      match = rule
      // TODO: we could bail out early here
      // Unclear whether that indicates error condition
      // return false
    }
  })
  return match
}

function parseComposedClassName(config) {
  return function parseClassName(inputClassName) {
    const {
      theme: { screens },
      separator
    } = config

    const variants = postcss.list.split(inputClassName, [separator])
    const utility = variants.pop()
    const screenName = variants[0]

    const isResponsive = Object.keys(screens).includes(screenName)

    if (isResponsive) {
      variants.shift()
    }

    const screen = isResponsive ? screens[screenName] : null

    return {
      utility,
      variants,
      responsive: isResponsive,
      screen,
      screenName
    }
  }
}

function variantAtRuleParams(atRule, parsed) {
  const currentVariantAtRuleParams = postcss.list.comma(atRule.params)

  const hasResponsiveVariant = currentVariantAtRuleParams.includes('responsive')
  // TODO: this is a fake option, probably should never be used
  const needsResponsiveWrapper =
    hasResponsiveVariant &&
    parsed.responsive &&
    parsed.useTailwindResponsiveAtRule

  const variantsParams = needsResponsiveWrapper
    ? currentVariantAtRuleParams
    : currentVariantAtRuleParams.filter(p => p !== 'responsive')

  if (!hasResponsiveVariant && parsed.responsive) {
    throw new Error(`Utility ${parsed.utility} is not responsive`)
  }

  // TODO: can we filter here to be contained in parsed.variants
  return variantsParams.join(', ')
}

function classValueForSelector(selector) {
  return selectorParser(selectors => {
    return selectors.first.filter(({ type }) => type === 'class').pop().value
  }).transformSync(selector)
}

function removeClassNameFromRule(rule, ruleClassName) {
  // TODO: file issue at https://github.com/postcss/postcss-selector-parser/
  // processSync does not default `updateSelector` option to `true`
  return selectorParser(selectors => {
    selectors.walkClasses(selectorClass => {
      if (selectorClass.value === ruleClassName) {
        if (selectorParser.isPseudo(selectorClass.next())) {
          const pseudoNesting = selectorParser.nesting()
          selectorClass.parent.insertBefore(selectorClass, pseudoNesting)
        }

        selectorClass.remove()
      }
    })
  }).processSync(rule, { updateSelector: true })
}

function getParentForParsedSelector(parsedSelector, root) {
  if (!parsedSelector.responsive) {
    return root
  }

  const screenMediaQueryParams = buildMediaQuery(parsedSelector.screen)

  let parent
  root.walkAtRules('media', mediaQuery => {
    if (mediaQuery.params === screenMediaQueryParams) {
      parent = mediaQuery
    }
  })

  if (!parent) {
    const screenMediaQuery = postcss.atRule({
      name: 'media',
      params: screenMediaQueryParams
    })
    root.append(screenMediaQuery)

    parent = screenMediaQuery
  }

  return parent
}

function twinMacro({ babel: { types: t }, references, state, config }) {
  const sourceRoot = state.file.opts.sourceRoot || '.'
  const program = state.file.path
  const configFile = config && config.config
  const configPath = resolve(
    sourceRoot,
    configFile || `./${TW_CONFIG_DEFAULT_FILENAME}`
  )
  const configExists = existsSync(configPath)

  state.tailwindConfigIdentifier = program.scope.generateUidIdentifier(
    'tailwindConfig'
  )
  state.tailwindUtilsIdentifier = program.scope.generateUidIdentifier(
    'tailwindUtils'
  )

  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    false
  state.isDev = isDev
  state.isProd = !isDev

  // Dev mode coming soon
  if (isDev) {
    state.isDev = false
    state.isProd = true
  }

  const tailwindConfig = configExists
    ? resolveConfig([require(configPath), defaultTailwindConfig])
    : resolveConfig([defaultTailwindConfig])

  const getConfig = () => {
    return tailwindConfig
  }

  const getProcessedPlugins = processTailwindPlugins(getConfig)

  // TODO: wrap with config HOF
  function toComposedSelectorVariant(baseClassName, variantPrefixes) {
    return variantPrefixes.reduce((composedName, variantPrefix) => {
      return buildSelectorVariant(
        composedName,
        variantPrefix,
        getConfig().separator,
        console.error
      )
    }, baseClassName)
  }

  const parseClassName = parseComposedClassName(getConfig())

  // Tailwind PostCSS plugins
  const customTailwindFeaturesPlugin = partiallyProcessTailwindFeatures(
    getConfig,
    getProcessedPlugins
  )
  const denormalizeVariants = substituteVariantsAtRules(
    getConfig(),
    getProcessedPlugins()
  )

  const template = postcss
    .root()
    .append('@tailwind base', '@tailwind components', '@tailwind utilities')

  const sharedTailwindDocument = customTailwindFeaturesPlugin(template)
  function getUtilityInDocument(document) {
    return function utilityRuleForSelector(selector) {
      return walkToUtilty(document.root, selector)
    }
  }

  const getSharedUtilityRule = getUtilityInDocument(sharedTailwindDocument)

  function getStylesFromTailwind(tailwindSelectors) {
    const final = postcss.root()

    for (const selector of tailwindSelectors) {
      const parsed = parseClassName(selector)
      const utilityClassName = normalizeClassName(parsed.utility)

      // TODO: might be component?
      const sharedUtilityRule = getSharedUtilityRule(utilityClassName)

      if (!sharedUtilityRule) {
        throw new Error(`Unknown utility "${utilityClassName}"`)
      }

      // TODO: anything else to consider?
      if (sharedUtilityRule.parent === sharedUtilityRule.root()) {
        final.append(sharedUtilityRule.clone().nodes)
        continue
      }

      const variantsAtRule = sharedUtilityRule.parent

      if (
        !variantsAtRule ||
        variantsAtRule.type !== 'atrule' ||
        variantsAtRule.name !== 'variants'
      ) {
        throw new MacroError(
          `Utility "${utilityClassName}" is not wrapped into "@variant". Please use plugins \`addUtilities\` method.`
        )
      }

      const atRuleForUtility = variantsAtRule
        .clone({
          params: variantAtRuleParams(variantsAtRule, parsed)
        })
        .removeAll()

      // TODO: they are not yet denormalized, only after function call below
      const denormalizedUtilityVariants = postcss
        .root()
        .append(atRuleForUtility.append(sharedUtilityRule.clone()))
      denormalizeVariants(denormalizedUtilityVariants)

      const denormalizedUtilityVariantSelector = toComposedSelectorVariant(
        utilityClassName,
        parsed.variants
      )
      const denormalizedUtilityVariantClassName = classValueForSelector(
        denormalizedUtilityVariantSelector
      )

      denormalizedUtilityVariants.walkRules(rule => {
        // TODO: passing whole `rule` should work here, too
        const ruleClassName = classValueForSelector(rule.selector)

        if (ruleClassName !== denormalizedUtilityVariantClassName) {
          rule.remove()
          return
        }

        const remainingSelector = removeClassNameFromRule(rule, ruleClassName)

        if (remainingSelector) {
          // This means we keep the nesting
        } else {
          rule.replaceWith(rule.nodes)
        }
      })

      const parent = getParentForParsedSelector(parsed, final)
      parent.append(denormalizedUtilityVariants)
    }

    return final
  }

  state.config = tailwindConfig

  if (!tailwindConfig) {
    throw new MacroError(`Couldn’t find the Tailwind config`)
  }

  const styledImport =
    config && config.styled
      ? {
          import: config.styled.import || 'default',
          from: config.styled.from || config.styled
        }
      : { import: 'default', from: '@emotion/styled' }

  // state.existingStyledIdentifier =
  //   state.styledIdentifier === null ? false : true
  // state.styledIdentifier = findIdentifier({
  //   program,
  //   mod: styledImport.from,
  //   name: styledImport.import
  // })

  // if (!state.existingStyledIdentifier) {
  //   state.styledIdentifier = program.scope.generateUidIdentifier('styled')
  // }

  state.existingStyledIdentifier = false
  state.styledIdentifier = findIdentifier({
    program,
    mod: styledImport.from,
    name: styledImport.import
  })
  if (state.styledIdentifier === null) {
    state.styledIdentifier = program.scope.generateUidIdentifier('styled')
  } else {
    state.existingStyledIdentifier = true
  }

  state.debug = config.debug || false
  state.configExists = configExists

  function getStyles(str, t, state) {
    const order = Object.keys(state.config.theme.screens)
    const selectors = orderByScreens(postcss.list.space(str), order)

    const styles = postcssJs.objectify(getStylesFromTailwind(selectors))

    const ast = astify(styles, t)
    return ast
  }

  program.traverse({
    JSXAttribute(path) {
      if (path.node.name.name !== 'tw') return
      const styles = getStyles(path.node.value.value, t, state)
      const attrs = path
        .findParent(p => p.isJSXOpeningElement())
        .get('attributes')
      const cssAttr = attrs.filter(p => p.node.name.name === 'css')

      if (cssAttr.length) {
        path.remove()
        const expr = cssAttr[0].get('value').get('expression')
        if (expr.isArrayExpression()) {
          expr.pushContainer('elements', styles)
        } else {
          expr.replaceWith(t.arrayExpression([expr.node, styles]))
        }
      } else {
        path.replaceWith(
          t.jsxAttribute(
            t.jsxIdentifier('css'),
            t.jsxExpressionContainer(styles)
          )
        )
      }
    }
  })

  references.default.forEach(path => {
    const parent = path.findParent(x => x.isTaggedTemplateExpression())
    if (!parent) return

    const parsed = parseTte({
      path: parent,
      types: t,
      styledIdentifier: state.styledIdentifier,
      state
    })
    if (!parsed) return

    replaceWithLocation(parsed.path, getStyles(parsed.str, t, state))
  })

  if (state.shouldImportStyled && !state.existingStyledIdentifier) {
    addImport({
      types: t,
      program,
      mod: styledImport.from,
      name: styledImport.import,
      identifier: state.styledIdentifier
    })
  }

  // if (state.shouldImportConfig) {
  //   const configImportPath =
  //     './' + relative(dirname(state.file.opts.filename), configPath)
  //   const originalConfigIdentifier = program.scope.generateUidIdentifier(
  //     'tailwindConfig'
  //   )

  //   program.unshiftContainer(
  //     'body',
  //     t.variableDeclaration('const', [
  //       t.variableDeclarator(
  //         state.tailwindConfigIdentifier,
  //         t.callExpression(
  //           t.memberExpression(
  //             state.tailwindUtilsIdentifier,
  //             t.identifier('resolveConfig')
  //           ),
  //           [configExists ? originalConfigIdentifier : t.objectExpression([])]
  //         )
  //       )
  //     ])
  //   )
  //   if (configExists) {
  //     program.unshiftContainer(
  //       'body',
  //       t.importDeclaration(
  //         [t.importDefaultSpecifier(originalConfigIdentifier)],
  //         t.stringLiteral(configImportPath)
  //       )
  //     )
  //   }
  //   // Add the utils import
  //   program.unshiftContainer(
  //     'body',
  //     t.importDeclaration(
  //       [t.importDefaultSpecifier(state.tailwindUtilsIdentifier)],
  //       t.stringLiteral(UTILS_IMPORT_FILEPATH)
  //     )
  //   )
  // }

  program.scope.crawl()
}
