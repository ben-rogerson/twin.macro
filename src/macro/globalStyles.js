import deepMerge from 'lodash.merge'
import template from '@babel/template'
import {
  addImport,
  generateUid,
  generateTaggedTemplateExpression,
} from '../macroHelpers'
import { throwIf, getTheme, isClass, isEmpty, withAlpha } from '../utils'
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

const getGlobalDeclarationTte = ({ t, stylesUid, globalUid, styles }) =>
  t.variableDeclaration('const', [
    t.variableDeclarator(
      globalUid,
      generateTaggedTemplateExpression({ t, identifier: stylesUid, styles })
    ),
  ])

const getGlobalDeclarationProperty = props => {
  const { t, stylesUid, globalUid, state, styles } = props

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

// Trim out classes defined within the selector
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

const handleGlobalStylesFunction = props => {
  const { references } = props

  references.GlobalStyles && handleGlobalStylesJsx(props)
  references.globalStyles && handleGlobalStylesVariable(props)
}

const getGlobalStyles = ({ state }) => {
  // Create the magic theme function
  const theme = getTheme(state.config.theme)

  // Filter out classes as they're extracted as usable classes
  const strippedPlugins = filterClassSelectors(
    state.userPluginData && state.userPluginData.base
  )

  const resolvedStyles = globalStyles.map(gs =>
    typeof gs === 'function' ? gs({ theme, withAlpha }) : gs
  )

  if (strippedPlugins) resolvedStyles.push(strippedPlugins)

  const styles = resolvedStyles.reduce(
    (result, item) => deepMerge(result, item),
    {}
  )

  return styles
}

const handleGlobalStylesVariable = ({ references, state }) => {
  if (references.globalStyles.length === 0) return

  const styles = getGlobalStyles({ state })

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  references.globalStyles.forEach(path => {
    const templateStyles = `(${JSON.stringify(styles)})` // `template` requires () wrapping
    const convertedStyles = template(templateStyles, {
      placeholderPattern: false,
    })()

    path.replaceWith(convertedStyles)
  })
}

const handleGlobalStylesJsx = props => {
  const { references, program, t, state, config } = props

  if (references.GlobalStyles.length === 0) return

  throwIf(references.GlobalStyles.length > 1, () =>
    logGeneralError('Only one GlobalStyles import can be used')
  )

  const path = references.GlobalStyles[0]
  const parentPath = path.findParent(x => x.isJSXElement())

  throwIf(!parentPath, () =>
    logGeneralError(
      'GlobalStyles must be added as a JSX element, eg: <GlobalStyles />'
    )
  )

  const styles = convertCssObjectToString(getGlobalStyles({ state }))

  const globalUid = generateUid('GlobalStyles', program)
  const stylesUid = generateUid('globalImport', program)
  const declarationData = { t, globalUid, stylesUid, styles, state }

  if (state.isStyledComponents) {
    const declaration = getGlobalDeclarationTte(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  if (state.isEmotion) {
    const declaration = getGlobalDeclarationProperty(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
    // Check if the css import has already been imported
    // https://github.com/ben-rogerson/twin.macro/issues/313
    state.isImportingCss = !state.existingCssIdentifier
  }

  if (state.isGoober) {
    const declaration = getGlobalDeclarationTte(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  throwIf(state.isStitches, () =>
    logGeneralError('Use the “globalStyles” import with stitches')
  )

  addGlobalStylesImport({ identifier: stylesUid, t, program, config })
}

export { handleGlobalStylesFunction }
