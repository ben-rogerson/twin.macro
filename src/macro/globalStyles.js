import { addImport, generateUid } from '../macroHelpers'
import { throwIf, getTheme, isClass, isEmpty } from '../utils'
import { logGeneralError } from './../logging'
import userPresets from './../config/userPresets'
import globalStyles from './../config/globalStyles'

const getGlobalConfig = config => {
  const usedConfig =
    (config.global && config) ||
    userPresets[config.preset] ||
    userPresets.emotion
  return usedConfig.global
}

const addGlobalStylesImport = ({ program, t, identifier, config }) => {
  const globalConfig = getGlobalConfig(config)
  return addImport({
    types: t,
    program,
    identifier,
    name: globalConfig.import,
    mod: globalConfig.from,
  })
}

const generateTaggedTemplateExpression = ({ identifier, t, styles }) => {
  const backtickStyles = t.templateElement({
    raw: `${styles}`,
    cooked: `${styles}`,
  })
  const ttExpression = t.taggedTemplateExpression(
    identifier,
    t.templateLiteral([backtickStyles], [])
  )
  return ttExpression
}

const getGlobalDeclarationTte = ({ t, stylesUid, globalUid, styles }) =>
  t.variableDeclaration('const', [
    t.variableDeclarator(
      globalUid,
      generateTaggedTemplateExpression({
        t,
        identifier: stylesUid,
        styles,
      })
    ),
  ])

const getGlobalDeclarationProperty = ({
  t,
  stylesUid,
  globalUid,
  state,
  styles,
}) => {
  const ttExpression = generateTaggedTemplateExpression({
    t,
    identifier: state.cssIdentifier,
    styles,
  })

  const openingElement = t.jsxOpeningElement(
    t.jsxIdentifier(stylesUid.name),
    [
      t.jsxAttribute(
        t.jsxIdentifier('styles'),
        t.jsxExpressionContainer(ttExpression)
      ),
    ],
    true
  )

  const closingElement = t.jsxClosingElement(t.jsxIdentifier('close'))

  const arrowFunctionExpression = t.arrowFunctionExpression(
    [],
    t.jsxElement(openingElement, closingElement, [], true)
  )

  const code = t.variableDeclaration('const', [
    t.variableDeclarator(globalUid, arrowFunctionExpression),
  ])

  return code
}

const kebabize = string =>
  string.replace(/([\da-z]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()

const convertCssObjectToString = cssObject => {
  if (!cssObject) return

  return Object.entries(cssObject)
    .map(([k, v]) =>
      typeof v === 'string'
        ? `${kebabize(k)}: ${v};`
        : `${k} {
${convertCssObjectToString(v)}
        }`
    )
    .join('\n')
}

/**
 * Trim out classes defined within the selector
 * @param {object} data Input object from userPluginData
 * @returns {object} An object containing unpacked selectors
 */
const filterClassSelectors = ruleset => {
  if (isEmpty(ruleset)) return

  return Object.entries(ruleset).reduce((result, [selector, value]) => {
    // Trim out the classes defined within the selector
    // Classes added using addBase have already been grabbed so they get filtered to avoid duplication
    const filteredSelectorSet = selector
      .split(',')
      .filter(s => {
        if (isClass(s)) return false

        // Remove sub selectors with a class as one of their keys
        const subSelectors = Object.keys(value)
        const hasSubClasses = subSelectors.some(selector => isClass(selector))
        if (hasSubClasses) return false

        return true
      })
      .join(',')
    if (!filteredSelectorSet) return result

    return { ...result, [filteredSelectorSet]: value }
  }, {})
}

const handleGlobalStylesFunction = ({
  references,
  program,
  t,
  state,
  config,
}) => {
  if (!references.GlobalStyles) return
  if (references.GlobalStyles.length === 0) return

  throwIf(references.GlobalStyles.length > 1, () =>
    logGeneralError('Only one GlobalStyles import can be used')
  )

  const path = references.GlobalStyles[0]
  const parentPath = path.findParent(x => x.isJSXElement())

  throwIf(state.isStyledComponents && !parentPath, () =>
    logGeneralError(
      'GlobalStyles must be added as a JSX element, eg: <GlobalStyles />'
    )
  )

  const globalUid = generateUid('GlobalStyles', program)
  const stylesUid = generateUid('globalImport', program)

  // Create the magic theme function
  const theme = getTheme(state.config.theme)

  // Filter out classes as they're extracted as usable classes
  const strippedPlugins = filterClassSelectors(
    state.userPluginData && state.userPluginData.base
  )

  // Provide each global style function with context and convert to a string
  const baseStyles = convertCssObjectToString(strippedPlugins)

  const styles = [
    globalStyles.map(globalFunction => globalFunction({ theme })).join('\n'),
    baseStyles,
  ]
    .filter(Boolean)
    .join('\n')

  if (state.isStyledComponents) {
    const declaration = getGlobalDeclarationTte({
      t,
      globalUid,
      stylesUid,
      styles,
    })
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  if (state.isEmotion) {
    const declaration = getGlobalDeclarationProperty({
      t,
      globalUid,
      stylesUid,
      state,
      styles,
    })
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
    // Check if the css import has already been imported
    // https://github.com/ben-rogerson/twin.macro/issues/313
    state.isImportingCss = !state.existingCssIdentifier
  }

  if (state.isGoober) {
    const declaration = getGlobalDeclarationTte({
      t,
      globalUid,
      stylesUid,
      styles,
    })
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  addGlobalStylesImport({
    identifier: stylesUid,
    t,
    program,
    config,
  })
}

export { handleGlobalStylesFunction }
