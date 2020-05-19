import { addImport } from './../macroHelpers'
import { isEmpty } from './../utils'
import userPresets from './../config/userPresets'

const getStyledConfig = config => {
  const usedConfig =
    userPresets[config.preset] ||
    (config.styled && config) ||
    userPresets.emotion

  if (typeof usedConfig.styled === 'string') {
    return { import: 'default', from: usedConfig.styled }
  }

  return usedConfig.styled
}

const updateStyledReferences = (references, state) => {
  if (isEmpty(references)) return
  if (state.existingStyledIdentifier) return

  references.forEach(path => {
    path.node.name = state.styledIdentifier.name
  })
}

const addStyledImport = ({ program, t, styledImport, state }) =>
  addImport({
    types: t,
    program,
    name: styledImport.import,
    mod: styledImport.from,
    identifier: state.styledIdentifier,
  })

export { getStyledConfig, updateStyledReferences, addStyledImport }
