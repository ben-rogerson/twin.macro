import { addImport } from './../macroHelpers'
import { isEmpty } from './../utils'
import userPresets from './../config/userPresets'

const getCssConfig = config => {
  const usedConfig =
    userPresets[config.preset] || (config.css && config) || userPresets.emotion

  if (typeof usedConfig.css === 'string') {
    return { import: 'css', from: usedConfig.css }
  }

  return usedConfig.css
}

const updateCssReferences = (references, state) => {
  if (isEmpty(references)) return
  if (state.existingCssIdentifier) return

  references.forEach(path => {
    path.node.name = state.cssIdentifier.name
  })
}

const addCssImport = ({ program, t, cssImport, state }) =>
  addImport({
    types: t,
    program,
    name: cssImport.import,
    mod: cssImport.from,
    identifier: state.cssIdentifier,
  })

/**
 * Auto add the styled-components css prop
 *
 * When using styled-components, the css prop isn't
 * added until you've imported the macro: "import 'styled-components/macro'".
 * This code aims to automate that import.
 */
const maybeAddCssProperty = ({ program, t }) => {
  let shouldAddImport = true
  let twinImportPath
  const styledComponentsMacroImport = 'styled-components/macro'

  // Search for a styled-components import
  // TODO: Merge this traversal into ImportDeclaration traversal for perf
  program.traverse({
    ImportDeclaration(path) {
      // Find the twin import path
      if (path.node.source.value === 'twin.macro') {
        twinImportPath = path
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
      [
        t.importDefaultSpecifier(
          program.scope.generateUidIdentifier('cssPropImport')
        ),
      ],
      t.stringLiteral(styledComponentsMacroImport)
    )
  )
}

export { getCssConfig, updateCssReferences, addCssImport, maybeAddCssProperty }
