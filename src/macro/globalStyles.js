import template from '@babel/template'
// eslint-disable-next-line import/no-relative-parent-imports
import { getGlobalStyles } from '../core'
import { logGeneralError } from './lib/logging'
import {
  addImport,
  generateUid,
  generateTaggedTemplateExpression,
} from './lib/astHelpers'
import throwIf from './lib/util/throwIf'

function addGlobalStylesImport({ program, t, identifier, coreContext }) {
  addImport({
    types: t,
    program,
    identifier,
    name: coreContext.importConfig.global.import,
    mod: coreContext.importConfig.global.from,
  })
}

function getGlobalDeclarationTte({ t, stylesUid, globalUid, styles }) {
  return t.variableDeclaration('const', [
    t.variableDeclarator(
      globalUid,
      generateTaggedTemplateExpression({ t, identifier: stylesUid, styles })
    ),
  ])
}

function getGlobalDeclarationProperty(params) {
  const { t, stylesUid, globalUid, state, styles } = params

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

function kebabize(string) {
  return string.replace(/([\da-z]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

function convert(k, v) {
  return typeof v === 'string'
    ? `  ${kebabize(k)}: ${v};`
    : `${k} {
${convertCssObjectToString(v)}
}`
}

function convertCssObjectToString(cssObject) {
  if (!cssObject) return
  return Object.entries(cssObject)
    .map(([k, v]) => convert(k, v))
    .join('\n')
}

function handleGlobalStylesFunction(params) {
  const { references } = params
  if (references.GlobalStyles) handleGlobalStylesJsx(params)
  if (references.globalStyles) handleGlobalStylesVariable(params)
}

function handleGlobalStylesVariable(params) {
  const { references } = params
  if (references.globalStyles.length === 0) return

  const styles = getGlobalStyles(params.coreContext)

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

function handleGlobalStylesJsx(params) {
  const { references, program, t, state, coreContext } = params
  if (references.GlobalStyles.length === 0) return

  throwIf(references.GlobalStyles.length > 1, () =>
    logGeneralError('Only one GlobalStyles import can be used')
  )

  const path = references.GlobalStyles[0]
  const parentPath = path.findParent(x => x.isJSXElement())

  throwIf(!parentPath, () =>
    logGeneralError(
      'The `GlobalStyles` import must be added as a JSX element, eg: `<GlobalStyles />`.\nUse the `globalStyles` import for an object of styles that can be used anywhere.'
    )
  )

  const globalStyles = getGlobalStyles(params.coreContext)

  const styles = convertCssObjectToString(globalStyles)

  const globalUid = generateUid('GlobalStyles', program)
  const stylesUid = generateUid('globalImport', program)
  const declarationData = { t, globalUid, stylesUid, styles, state }

  if (coreContext.packageUsed.isStyledComponents) {
    const declaration = getGlobalDeclarationTte(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  if (coreContext.packageUsed.isEmotion) {
    const declaration = getGlobalDeclarationProperty(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
    // Check if the css import has already been imported
    // https://github.com/ben-rogerson/twin.macro/issues/313
    state.isImportingCss = !state.existingCssIdentifier
  }

  if (coreContext.packageUsed.isGoober) {
    const declaration = getGlobalDeclarationTte(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  throwIf(coreContext.packageUsed.isStitches, () =>
    logGeneralError('Use the `globalStyles` import with stitches')
  )

  addGlobalStylesImport({
    identifier: stylesUid,
    t,
    program,
    coreContext,
  })
}

export { handleGlobalStylesFunction }
