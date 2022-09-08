import { addImport, replaceWithLocation } from './lib/astHelpers'
import isEmpty from './lib/util/isEmpty'
import get from './lib/util/get'
import type { T, NodePath, AdditionalHandlerParameters } from './types'

function updateStyledReferences({
  references,
  state,
}: AdditionalHandlerParameters): void {
  if (state.existingStyledIdentifier) return

  const styledReferences = references.styled
  if (isEmpty(styledReferences)) return

  styledReferences.forEach(path => {
    // @ts-expect-error Setting values is untyped
    path.node.name = state.styledIdentifier.name
  })
}

function addStyledImport({
  references,
  program,
  t,
  state,
  coreContext,
}: AdditionalHandlerParameters): void {
  if (!state.isImportingStyled) {
    const shouldImport =
      !isEmpty(references.styled) && !state.existingStyledIdentifier
    if (!shouldImport) return
  }

  if (state.existingStyledIdentifier) return

  addImport({
    types: t,
    program,
    name: coreContext.importConfig.styled.import,
    mod: coreContext.importConfig.styled.from,
    identifier: state.styledIdentifier,
  })
}

function moveDotElementToParam({
  path,
  t,
}: {
  path: NodePath
  t: typeof T
}): void {
  if (path.parent.type !== 'MemberExpression') return

  const parentCallExpression = path.findParent(x =>
    x.isCallExpression()
  ) as NodePath<T.CallExpression>
  if (!parentCallExpression) return

  const styledName = get(path, 'parentPath.node.property.name') as string
  const styledArgs = get(parentCallExpression, 'node.arguments.0') as
    | T.Expression
    | T.SpreadElement
    | T.JSXNamespacedName
    | T.ArgumentPlaceholder
  const args = [t.stringLiteral(styledName), styledArgs].filter(Boolean)
  const replacement = t.callExpression(
    (path as NodePath<T.Expression>).node,
    args
  )

  replaceWithLocation(parentCallExpression, replacement)
}

function handleStyledFunction({
  references,
  t,
  coreContext,
}: AdditionalHandlerParameters): void {
  if (!coreContext.twinConfig.convertStyledDot) return
  if (isEmpty(references)) return

  const defaultRefs = references.default || []
  const styledRefs = references.styled || []

  ;[...defaultRefs, ...styledRefs]
    .filter(Boolean)
    .forEach((path: NodePath): void => {
      // convert tw.div`` & styled.div`` to styled('div', {})
      moveDotElementToParam({ path, t })
    })
}

export { updateStyledReferences, addStyledImport, handleStyledFunction }
