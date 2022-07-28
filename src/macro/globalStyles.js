import template from '@babel/template'
// eslint-disable-next-line import/no-relative-parent-imports
import { getGlobalStyles } from '../core'
import userPresets from './config/userPresets'
import { logGeneralError } from './lib/logging'
import {
  addImport,
  generateUid,
  generateTaggedTemplateExpression,
} from './lib/astHelpers'
import throwIf from './lib/util/throwIf'

const getGlobalConfig = config => {
  const usedConfig =
    (config.global && config) ||
    userPresets[config.preset] ||
    userPresets.emotion
  return usedConfig.global
}

const addGlobalStylesImport = ({ program, t, identifier, config }) => {
  const globalConfig = getGlobalConfig(config)
  addImport({
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

const getGlobalDeclarationProperty = params => {
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

const handleGlobalStylesFunction = params => {
  const { references } = params

  if (references.GlobalStyles) handleGlobalStylesJsx(params)
  if (references.globalStyles) handleGlobalStylesVariable(params)
}

const handleGlobalStylesVariable = params => {
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

const handleGlobalStylesJsx = params => {
  const { references, program, t, state, config } = params
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

  const globalStyles = getGlobalStyles(params.coreContext)

  const styles = convertCssObjectToString(globalStyles)

  const globalUid = generateUid('GlobalStyles', program)
  const stylesUid = generateUid('globalImport', program)
  const declarationData = { t, globalUid, stylesUid, styles, state }

  if (state.packageUsed.isStyledComponents) {
    const declaration = getGlobalDeclarationTte(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  if (state.packageUsed.isEmotion) {
    const declaration = getGlobalDeclarationProperty(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
    // Check if the css import has already been imported
    // https://github.com/ben-rogerson/twin.macro/issues/313
    state.isImportingCss = !state.existingCssIdentifier
  }

  if (state.packageUsed.isGoober) {
    const declaration = getGlobalDeclarationTte(declarationData)
    program.unshiftContainer('body', declaration)
    path.replaceWith(t.jSXIdentifier(globalUid.name))
  }

  throwIf(state.packageUsed.isStitches, () =>
    logGeneralError('Use the `globalStyles` import with stitches')
  )

  addGlobalStylesImport({ identifier: stylesUid, t, program, config })
}

export { handleGlobalStylesFunction }
