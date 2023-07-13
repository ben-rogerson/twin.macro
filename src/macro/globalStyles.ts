// eslint-disable-next-line import/no-relative-parent-imports
import { getGlobalStyles } from '../core'
import template from '@babel/template'
import {
  addImport,
  generateUid,
  generateTaggedTemplateExpression,
} from './lib/astHelpers'
import type {
  CoreContext,
  AdditionalHandlerParameters,
  NodePath,
  State,
  T,
  CssObject,
} from './types'

const KEBAB_CANDIDATES = /([\da-z]|(?=[A-Z]))([A-Z])/g

type AddGlobalStylesImport = {
  program: NodePath<T.Program>
  t: typeof T
  identifier: T.Identifier
  coreContext: CoreContext
}

function addGlobalStylesImport({
  program,
  t,
  identifier,
  coreContext,
}: AddGlobalStylesImport): void {
  addImport({
    types: t,
    program,
    identifier,
    name: coreContext.importConfig.global.import,
    mod: coreContext.importConfig.global.from,
  })
}

export type DeclarationParameters = {
  t: typeof T
  state: State
  globalUid: T.Identifier
  stylesUid: T.Identifier
  styles: string | undefined
}

function getGlobalDeclarationTte({
  t,
  stylesUid,
  globalUid,
  styles,
}: DeclarationParameters): T.VariableDeclaration {
  return t.variableDeclaration('const', [
    t.variableDeclarator(
      globalUid,
      generateTaggedTemplateExpression({ t, identifier: stylesUid, styles })
    ),
  ])
}

function getGlobalDeclarationProperty(
  params: DeclarationParameters
): T.VariableDeclaration {
  const { t, stylesUid, globalUid, state, styles } = params

  const ttExpression = generateTaggedTemplateExpression({
    t,
    identifier: state.cssIdentifier as T.Identifier,
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

function kebabize(string: string): string {
  return string.replace(KEBAB_CANDIDATES, '$1-$2').toLowerCase()
}

function convert(k: string, v: string | number): string {
  return typeof v === 'string'
    ? `  ${kebabize(k)}: ${v};`
    : `${k} {
${convertCssObjectToString(v)}
}`
}

function convertCssObjectToString(
  cssObject: CssObject | string | number | undefined
): string {
  if (!cssObject) return ''
  return Object.entries(cssObject)
    .map(([k, v]) => convert(k, v))
    .join('\n')
}

function handleGlobalStylesFunction(params: AdditionalHandlerParameters): void {
  const { references } = params
  if (references.GlobalStyles) handleGlobalStylesJsx(params)
  if (references.globalStyles) handleGlobalStylesVariable(params)
}

function handleGlobalStylesVariable(params: AdditionalHandlerParameters): void {
  const { references } = params
  if (references.globalStyles.length === 0) return

  const styles = getGlobalStyles(params.coreContext)

  references.globalStyles.forEach(path => {
    const templateStyles = `(${JSON.stringify(styles)})` // `template` requires () wrapping
    const convertedStyles = template(templateStyles, {
      placeholderPattern: false,
    })()

    path.replaceWith(convertedStyles as NodePath)
  })
}

function handleGlobalStylesJsx(params: AdditionalHandlerParameters): void {
  const { references, program, t, state, coreContext } = params
  if (references.GlobalStyles.length === 0) return

  coreContext.assert(
    references.GlobalStyles.length < 2,
    ({ color }) =>
      `${color(
        `✕ Only one <GlobalStyles /> can be added per file`
      )}\n\nNeed something custom?\nUse the \`globalStyles\` import for a style object you can work with`
  )

  const path = references.GlobalStyles[0]
  const parentPath = path.findParent(x => x.isJSXElement())

  coreContext.assert(
    Boolean(parentPath),
    ({ color }) =>
      `${color(
        `✕ The \`GlobalStyles\` import must be added as a JSX element`
      )}\neg: \`<GlobalStyles />\`\n\nNeed something custom?\nUse the \`globalStyles\` import for a style object you can work with`
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

  if (coreContext.packageUsed.isGoober || coreContext.packageUsed.isSolid) {
    const declaration = getGlobalDeclarationTte(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  coreContext.assert(
    Boolean(!coreContext.packageUsed.isStitches),
    ({ color }) =>
      `${color(
        `✕ The ${color(
          'GlobalStyles',
          'errorLight'
        )} import can’t be used with stitches`
      )}\n\nUse the ${color(`globalStyles`, 'success')} import instead`
  )

  addGlobalStylesImport({
    identifier: stylesUid,
    t,
    program,
    coreContext,
  })
}

export { handleGlobalStylesFunction }
