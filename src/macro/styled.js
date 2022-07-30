import { addImport, replaceWithLocation } from './lib/astHelpers'
import isEmpty from './lib/util/isEmpty'
import get from './lib/util/get'

function updateStyledReferences({ references, state }) {
  if (state.existingStyledIdentifier) return

  const styledReferences = references.styled
  if (isEmpty(styledReferences)) return

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  styledReferences.forEach(path => {
    path.node.name = state.styledIdentifier.name
  })
}

function addStyledImport({ references, program, t, state, coreContext }) {
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

function moveDotElementToParam({ path, t }) {
  if (path.parent.type !== 'MemberExpression') return

  const parentCallExpression = path.findParent(x => x.isCallExpression())
  if (!parentCallExpression) return

  const styledName = get(path, 'parentPath.node.property.name')
  const styledArgs = get(parentCallExpression, 'node.arguments.0')
  const args = [t.stringLiteral(styledName), styledArgs].filter(Boolean)
  const replacement = t.callExpression(path.node, args)

  replaceWithLocation(parentCallExpression, replacement)
}

function handleStyledFunction({ references, t, coreContext }) {
  if (!coreContext.twinConfig.convertStyledDot) return
  if (isEmpty(references)) return
  ;[...(references.default || []), ...(references.styled || [])]
    .filter(Boolean)
    // FIXME: Remove comment and fix next line
    // eslint-disable-next-line unicorn/no-array-for-each
    .forEach(path => {
      // convert tw.div`` & styled.div`` to styled('div', {})
      moveDotElementToParam({ path, t })
    })
}

export { updateStyledReferences, addStyledImport, handleStyledFunction }
