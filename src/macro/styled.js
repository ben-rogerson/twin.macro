import { addImport, replaceWithLocation } from './../macroHelpers'
import { isEmpty, get } from './../utils'
import userPresets from './../config/userPresets'
import { getStitchesPath } from './../configHelpers'

const getStyledConfig = ({ state, config }) => {
  const usedConfig =
    (config.styled && config) ||
    userPresets[config.preset] ||
    userPresets.emotion

  if (typeof usedConfig.styled === 'string') {
    return { import: 'default', from: usedConfig.styled }
  }

  if (config.preset === 'stitches') {
    const stitchesPath = getStitchesPath(state, config)
    if (stitchesPath) {
      // Overwrite the stitches import data with the path from the current file
      usedConfig.styled.from = stitchesPath
    }
  }

  return usedConfig.styled
}

const updateStyledReferences = ({ references, state }) => {
  if (state.existingStyledIdentifier) return

  const styledReferences = references.styled
  if (isEmpty(styledReferences)) return

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  styledReferences.forEach(path => {
    path.node.name = state.styledIdentifier.name
  })
}

const addStyledImport = ({ references, program, t, styledImport, state }) => {
  if (!state.isImportingStyled) {
    const shouldImport =
      !isEmpty(references.styled) && !state.existingStyledIdentifier
    if (!shouldImport) return
  }

  if (state.existingStyledIdentifier) return

  addImport({
    types: t,
    program,
    name: styledImport.import,
    mod: styledImport.from,
    identifier: state.styledIdentifier,
  })
}

const moveDotElementToParam = ({ path, t }) => {
  if (path.parent.type !== 'MemberExpression') return

  const parentCallExpression = path.findParent(x => x.isCallExpression())
  if (!parentCallExpression) return

  const styledName = get(path, 'parentPath.node.property.name')
  const styledArgs = get(parentCallExpression, 'node.arguments.0')
  const args = [t.stringLiteral(styledName), styledArgs].filter(Boolean)
  const replacement = t.callExpression(path.node, args)

  replaceWithLocation(parentCallExpression, replacement)
}

const handleStyledFunction = ({ references, t, state }) => {
  if (!state.configTwin.convertStyledDot) return
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

export {
  getStyledConfig,
  updateStyledReferences,
  addStyledImport,
  handleStyledFunction,
}
