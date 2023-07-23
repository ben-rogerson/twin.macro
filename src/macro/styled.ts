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

function moveDotElement({
  path,
  t,
  moveToParam = true,
}: {
  path: NodePath
  t: typeof T
  moveToParam: boolean
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
    | T.ArrowFunctionExpression

  let replacement
  if (moveToParam) {
    // `styled('div', {})`
    const args = [t.stringLiteral(styledName), styledArgs].filter(Boolean)
    replacement = t.callExpression((path as NodePath<T.Expression>).node, args)
  } else {
    // `styled('div')({})`
    const callee = t.callExpression((path as NodePath<T.Expression>).node, [
      t.stringLiteral(styledName),
    ])
    replacement = t.expressionStatement(t.callExpression(callee, [styledArgs]))
  }

  replaceWithLocation(parentCallExpression, replacement)
}

function handleStyledFunction({
  references,
  t,
  coreContext,
}: AdditionalHandlerParameters): void {
  if (
    !coreContext.twinConfig.convertStyledDotToParam &&
    !coreContext.twinConfig.convertStyledDotToFunction
  )
    return
  if (isEmpty(references)) return

  const defaultRefs = references.default || []
  const styledRefs = references.styled || []

  const refs = [...defaultRefs, ...styledRefs].filter(Boolean)

  refs.forEach((path: NodePath): void => {
    // convert tw.div`` & styled.div`` to styled('div', {}) / styled('div')({})
    moveDotElement({
      path,
      t,
      moveToParam: coreContext.twinConfig.convertStyledDotToParam ?? true,
    })
  })
}

export { updateStyledReferences, addStyledImport, handleStyledFunction }
