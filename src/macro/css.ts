import { addImport, makeStyledComponent } from './lib/astHelpers'
import isEmpty from './lib/util/isEmpty'
import type {
  T,
  AdditionalHandlerParameters,
  HandlerParameters,
  NodePath,
} from './types'

function updateCssReferences({
  references,
  state,
}: AdditionalHandlerParameters): void {
  if (state.existingCssIdentifier) return

  const cssReferences = references.css
  if (isEmpty(cssReferences)) return

  cssReferences.forEach(path => {
    // @ts-expect-error Setting value on target
    path.node.name = state.cssIdentifier.name
  })
}

function addCssImport({
  references,
  program,
  t,
  state,
  coreContext,
}: AdditionalHandlerParameters): void {
  if (!state.isImportingCss) {
    const shouldImport =
      !isEmpty(references.css) && !state.existingCssIdentifier
    if (!shouldImport) return
  }

  if (state.existingCssIdentifier) return
  if (!coreContext.importConfig.css) return

  addImport({
    types: t,
    program,
    name: coreContext.importConfig.css.import,
    mod: coreContext.importConfig.css.from,
    identifier: state.cssIdentifier,
  })
}

function convertHtmlElementToStyled(
  params: HandlerParameters & { path: NodePath<T.JSXElement> }
): void {
  const { path, t, coreContext } = params
  if (!coreContext.twinConfig.convertHtmlElementToStyled) return

  const jsxPath = path.get('openingElement')

  makeStyledComponent({
    ...params,
    jsxPath,
    secondArg: t.objectExpression([]),
    fromProp: 'css',
  })
}

export { updateCssReferences, addCssImport, convertHtmlElementToStyled }
