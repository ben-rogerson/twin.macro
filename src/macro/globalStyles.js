import { addImport, generateUid } from '../macroHelpers'
import { throwIf } from '../utils'
import { logGeneralError } from './../logging'
import userPresets from './../config/userPresets'

const getGlobalStylesConfig = config => {
  const usedConfig =
    (config.global && config) ||
    userPresets[config.preset] ||
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

const generateTaggedTemplateExpression = ({ identifier, t, keyframes }) => {
  const backtickStyles = t.templateElement({
    raw: `${keyframes}`,
    cooked: `${keyframes}`,
  })
  const ttExpression = t.taggedTemplateExpression(
    identifier,
    t.templateLiteral([backtickStyles], [])
  )
  return ttExpression
}

const getGlobalDeclarationTte = ({ t, stylesUid, globalUid, keyframes }) =>
  t.variableDeclaration('const', [
    t.variableDeclarator(
      globalUid,
      generateTaggedTemplateExpression({
        t,
        identifier: stylesUid,
        keyframes,
      })
    ),
  ])

const getGlobalTte = ({ t, stylesUid, keyframes }) =>
  generateTaggedTemplateExpression({ t, identifier: stylesUid, keyframes })

const getGlobalDeclarationProperty = ({
  t,
  stylesUid,
  globalUid,
  state,
  keyframes,
}) => {
  const ttExpression = generateTaggedTemplateExpression({
    t,
    identifier: state.cssIdentifier,
    keyframes,
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

const getKeyframesString = keyframes =>
  Object.entries(keyframes)
    .map(
      ([name, frames]) => `
      @keyframes ${name} {${Object.entries(frames)
        .map(
          ([offset, styles]) => `
          ${offset} { 
            ${Object.entries(styles)
              .map(([key, value]) => `${key}: ${value};`)
              .join(' ')}
          }
        `
        )
        .join('')}}`
    )
    .join('')

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

  const themeKeyframes = state.config.theme.keyframes || {}
  const keyframes = getKeyframesString(themeKeyframes)

  const globalUid = generateUid('GlobalStyles', program)
  const stylesUid = generateUid('globalImport', program)

  if (state.isStyledComponents) {
    const declaration = getGlobalDeclarationTte({
      t,
      globalUid,
      stylesUid,
      keyframes,
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
      keyframes,
    })
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
    state.isImportingCss = true
  }

  if (state.isGoober) {
    const declaration = getGlobalTte({ t, stylesUid, keyframes })
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
