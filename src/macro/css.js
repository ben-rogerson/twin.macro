import { addImport } from './../macroHelpers'
import { isEmpty } from './../utils'

const getCssConfig = config =>
  config && config.css
    ? {
        import: config.css.import || 'css',
        from: config.css.from || config.css,
      }
    : { import: 'css', from: '@emotion/core' }

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

export { getCssConfig, updateCssReferences, addCssImport }
