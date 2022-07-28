// eslint-disable-next-line import/no-relative-parent-imports
import { getStitchesPath } from '../core'
import userPresets from './config/userPresets'
import { addImport, makeStyledComponent } from './lib/astHelpers'
import isEmpty from './lib/util/isEmpty'

const getCssConfig = ({ state, config }) => {
  const usedConfig =
    (config.css && config) || userPresets[config.preset] || userPresets.emotion

  if (typeof usedConfig.css === 'string') {
    return { import: 'css', from: usedConfig.css }
  }

  if (config.preset === 'stitches') {
    const stitchesPath = getStitchesPath(state, config)
    if (stitchesPath) {
      // Overwrite the stitches import data with the path from the current file
      usedConfig.css.from = stitchesPath
    }
  }

  return usedConfig.css
}

const updateCssReferences = ({ references, state }) => {
  if (state.existingCssIdentifier) return

  const cssReferences = references.css
  if (isEmpty(cssReferences)) return

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  cssReferences.forEach(path => {
    path.node.name = state.cssIdentifier.name
  })
}

const addCssImport = ({ references, program, t, cssImport, state }) => {
  if (!state.isImportingCss) {
    const shouldImport =
      !isEmpty(references.css) && !state.existingCssIdentifier
    if (!shouldImport) return
  }

  if (state.existingCssIdentifier) return

  addImport({
    types: t,
    program,
    name: cssImport.import,
    mod: cssImport.from,
    identifier: state.cssIdentifier,
  })
}

const convertHtmlElementToStyled = params => {
  const { path, t, state } = params
  if (!state.configTwin.convertHtmlElementToStyled) return

  const jsxPath = path.parentPath
  makeStyledComponent({ ...params, jsxPath, secondArg: t.objectExpression([]) })
}

export {
  getCssConfig,
  updateCssReferences,
  addCssImport,
  convertHtmlElementToStyled,
}
