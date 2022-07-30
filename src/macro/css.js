import { addImport, makeStyledComponent } from './lib/astHelpers'
import isEmpty from './lib/util/isEmpty'

function updateCssReferences({ references, state }) {
  if (state.existingCssIdentifier) return

  const cssReferences = references.css
  if (isEmpty(cssReferences)) return

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  cssReferences.forEach(path => {
    path.node.name = state.cssIdentifier.name
  })
}

function addCssImport({ references, program, t, state, coreContext }) {
  if (!state.isImportingCss) {
    const shouldImport =
      !isEmpty(references.css) && !state.existingCssIdentifier
    if (!shouldImport) return
  }

  if (state.existingCssIdentifier) return

  addImport({
    types: t,
    program,
    name: coreContext.importConfig.css.import,
    mod: coreContext.importConfig.css.from,
    identifier: state.cssIdentifier,
  })
}

function convertHtmlElementToStyled(params) {
  const { path, t, coreContext } = params
  if (!coreContext.twinConfig.convertHtmlElementToStyled) return

  const jsxPath = path.parentPath
  makeStyledComponent({ ...params, jsxPath, secondArg: t.objectExpression([]) })
}

export { updateCssReferences, addCssImport, convertHtmlElementToStyled }
