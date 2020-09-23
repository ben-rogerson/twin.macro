import { addImport, generateUid } from '../macroHelpers'
import { assert } from '../utils'
import { logGeneralError } from './../logging'
import globalStyles from './../config/globalStyles'
import userPresets from './../config/userPresets'

const getGlobalStylesConfig = config => {
  const usedConfig =
    userPresets[config.preset] ||
    (config.global && config) ||
    userPresets.emotion
  return usedConfig.global
}

const addGlobalStylesImport = ({ program, t, identifier, config }) => {
  const globalStyleConfig = getGlobalStylesConfig(config)
  return addImport({
    types: t,
    program,
    identifier,
    name: globalStyleConfig.import,
    mod: globalStyleConfig.from,
  })
}

const addGlobalCssImport = ({ identifier, t, program }) =>
  addImport({
    types: t,
    program,
    mod: 'tailwindcss/dist/base.min.css',
    identifier,
  })

const generateTaggedTemplateExpression = ({ identifier, t }) => {
  const backtickStyles = t.templateElement({
    raw: `${globalStyles}`,
    cooked: `${globalStyles}`,
  })
  const ttExpression = t.taggedTemplateExpression(
    identifier,
    t.templateLiteral([backtickStyles], [])
  )
  return ttExpression
}

const getGlobalDeclarationTte = ({ t, stylesUid, globalUid }) =>
  t.variableDeclaration('const', [
    t.variableDeclarator(
      globalUid,
      generateTaggedTemplateExpression({ t, identifier: stylesUid })
    ),
  ])

const getGlobalTte = ({ t, stylesUid }) =>
  generateTaggedTemplateExpression({ t, identifier: stylesUid })

const getGlobalDeclarationProperty = ({ t, stylesUid, globalUid, state }) => {
  const ttExpression = generateTaggedTemplateExpression({
    t,
    identifier: state.cssIdentifier,
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

const handleGlobalStylesFunction = ({
  references,
  program,
  t,
  state,
  config,
}) => {
  if (!references.GlobalStyles) return
  if (references.GlobalStyles.length === 0) return

  assert(references.GlobalStyles.length > 1, () =>
    logGeneralError('Only one GlobalStyles import can be used')
  )

  const path = references.GlobalStyles[0]
  const parentPath = path.findParent(x => x.isJSXElement())

  assert(state.isStyledComponents && !parentPath, () =>
    logGeneralError(
      'GlobalStyles must be added as a JSX element, eg: <GlobalStyles />'
    )
  )

  const globalUid = generateUid('GlobalStyles', program)
  const stylesUid = generateUid('globalImport', program)

  if (state.isStyledComponents) {
    const declaration = getGlobalDeclarationTte({
      t,
      globalUid,
      stylesUid,
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
    })
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
    state.isImportingCss = true
  }

  if (state.isGoober) {
    const declaration = getGlobalTte({ t, stylesUid })
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
