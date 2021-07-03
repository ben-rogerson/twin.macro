import { addImport, generateUid, makeStyledComponent } from './../macroHelpers'
import { isEmpty } from './../utils'
import userPresets from './../config/userPresets'
import { getStitchesPath } from './../configHelpers'

const getCssConfig = ({ state, config }) => {
  const usedConfig =
    (config.css && config) || userPresets[config.preset] || userPresets.emotion

  if (typeof usedConfig.css === 'string') {
    return { import: 'css', from: usedConfig.css }
  }

  if (config.preset === 'stitches') {
    const stitchesPath = getStitchesPath(state, config)
    if (stitchesPath) {
      // Overwrite the stitches import data with the path from the current file
      usedConfig.css.from = stitchesPath
    }
  }

  return usedConfig.css
}

const updateCssReferences = ({ references, state }) => {
  if (state.existingCssIdentifier) return

  const cssReferences = references.css
  if (isEmpty(cssReferences)) return

  cssReferences.forEach(path => {
    path.node.name = state.cssIdentifier.name
  })
}

const addCssImport = ({ references, program, t, cssImport, state }) => {
  if (!state.isImportingCss) {
    const shouldImport =
      !isEmpty(references.css) && !state.existingCssIdentifier
    if (!shouldImport) return
  }

  if (state.existingCssIdentifier) return

  addImport({
    types: t,
    program,
    name: cssImport.import,
    mod: cssImport.from,
    identifier: state.cssIdentifier,
  })
}

/**
 * Auto add the styled-components css prop
 *
 * When using styled-components, the css prop isn't
 * added until you've imported the macro: "import 'styled-components/macro'".
 * This code aims to automate that import.
 */
const handleAutoCssProp = ({ configTwin, state, program, t }) => {
  const addCssProperty =
    (state.hasTwAttribute || state.hasCssAttribute) &&
    configTwin.autoCssProp === true &&
    state.isStyledComponents
  if (!addCssProperty) return

  let shouldAddImport = true
  let twinImportPath

  // Intentionally hardcoded
  const styledComponentsMacroImport = 'styled-components/macro'

  // Search for a styled-components import
  // TODO: Merge this traversal into ImportDeclaration traversal for perf
  program.traverse({
    ImportDeclaration(path) {
      // Find the twin import path
      if (path.node.source.value === 'twin.macro') {
        twinImportPath = path
      } else if (path.node.source.value === './macro') {
        // Read the test import with a comment of (// twinImport) afterwards
        const { trailingComments } = path.node.source
        if (trailingComments && trailingComments[0].value === ' twinImport') {
          twinImportPath = path
        }
      }

      // If there's an existing macro import
      if (path.node.source.value === styledComponentsMacroImport)
        shouldAddImport = false
    },
  })

  if (!shouldAddImport) return

  /**
   * Import styled-components/macro AFTER the twin import
   * https://github.com/ben-rogerson/twin.macro/issues/68
   */
  twinImportPath.insertAfter(
    t.importDeclaration(
      [t.importDefaultSpecifier(generateUid('cssPropImport', program))],
      t.stringLiteral(styledComponentsMacroImport)
    )
  )
}

const convertHtmlElementToStyled = props => {
  const { path, t, state } = props
  if (!state.configTwin.convertHtmlElementToStyled) return

  const jsxPath = path.parentPath
  makeStyledComponent({ ...props, jsxPath, secondArg: t.objectExpression([]) })
}

export {
  getCssConfig,
  updateCssReferences,
  addCssImport,
  handleAutoCssProp,
  convertHtmlElementToStyled,
}
