import { addImport, generateUid } from '../macroHelpers'
import { throwIf, getTheme } from '../utils'
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

const addGlobalCssImport = ({ identifier, t, program }) =>
  addImport({
    types: t,
    program,
    mod: 'tailwindcss/dist/base.min.css',
    identifier,
  })

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

const getGlobalTte = ({ t, stylesUid, styles }) =>
  generateTaggedTemplateExpression({ t, identifier: stylesUid, styles })

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

  // Provide each global style function with context and convert to a string
  const baseStyles = convertCssObjectToString(
    state.userPluginData && state.userPluginData.base
  )

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
    state.isImportingCss = true
  }

  if (state.isGoober) {
    const declaration = getGlobalTte({ t, stylesUid, styles })
    program.unshiftContainer('body', declaration)
    parentPath.remove()
  }

  const baseCssIdentifier = generateUid('baseCss', program)

  addGlobalCssImport({ identifier: baseCssIdentifier, t, program })

  addGlobalStylesImport({
    identifier: stylesUid,
    t,
    program,
    config,
  })
}

export { handleGlobalStylesFunction }
