import { addImport } from './../macroHelpers'
import { isEmpty } from './../utils'

const getStyledConfig = config =>
  config && config.styled
    ? {
        import: config.styled.import || 'default',
        from: config.styled.from || config.styled,
      }
    : { import: 'default', from: '@emotion/styled' }

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
