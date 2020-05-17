import { createMacro } from 'babel-plugin-macros'
import { findIdentifier, parseTte, replaceWithLocation } from './macroHelpers'
import { isEmpty } from './utils'
import getStyles from './getStyles'
import { getConfigProperties } from './configHelpers'
import { getCssConfig, updateCssReferences, addCssImport } from './macro/css'
import {
  getStyledConfig,
  updateStyledReferences,
  addStyledImport,
} from './macro/styled'
import { handleTwProperty } from './macro/tw'

const twinMacro = ({ babel: { types: t }, references, state, config }) => {
  const program = state.file.path
  const { configExists, tailwindConfig } = getConfigProperties(state, config)

  state.config = tailwindConfig

  state.tailwindConfigIdentifier = program.scope.generateUidIdentifier(
    'tailwindConfig'
  )
  state.tailwindUtilsIdentifier = program.scope.generateUidIdentifier(
    'tailwindUtils'
  )

  /* eslint-disable-next-line unicorn/prevent-abbreviations */
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    false
  state.isDev = isDev
  state.isProd = !isDev

  // Dev mode coming soon
  if (isDev) {
    state.isDev = false
    state.isProd = true
  }

  // The { styled } import
  const styledImport = getStyledConfig(config)
  state.styledIdentifier = findIdentifier({
    program,
    mod: styledImport.from,
    name: styledImport.import,
  })
  if (state.styledIdentifier === null) {
    state.styledIdentifier = program.scope.generateUidIdentifier('styled')
  } else {
    state.existingStyledIdentifier = true
  }

  // The { css } import
  const cssImport = getCssConfig(config)
  state.cssIdentifier = findIdentifier({
    program,
    name: cssImport.import,
    mod: cssImport.from,
  })
  if (state.cssIdentifier === null) {
    state.cssIdentifier = program.scope.generateUidIdentifier('css')
  } else {
    state.existingCssIdentifier = true
  }

  state.debug = config.debug || false
  state.configExists = configExists

  state.hasSuggestions =
    typeof config.hasSuggestions === 'undefined' ? true : config.hasSuggestions

  handleTwProperty({ getStyles, program, t, state })

  // Tw import
  references.default.forEach(path => {
    const parent = path.findParent(x => x.isTaggedTemplateExpression())
    if (!parent) return

    const parsed = parseTte({
      path: parent,
      types: t,
      styledIdentifier: state.styledIdentifier,
      state,
    })
    if (!parsed) return

    replaceWithLocation(parsed.path, getStyles(parsed.string, t, state))
  })

  // { css } import
  updateCssReferences(references.css, state)
  if (!isEmpty(references.css)) state.shouldImportCss = true
  if (state.shouldImportCss && !state.existingCssIdentifier) {
    addCssImport({ program, t, cssImport, state })
  }

  // { styled } import
  updateStyledReferences(references.styled, state)
  if (!isEmpty(references.styled)) state.shouldImportStyled = true
  if (state.shouldImportStyled && !state.existingStyledIdentifier) {
    addStyledImport({ program, t, styledImport, state })
  }

  program.scope.crawl()
}

export default createMacro(twinMacro, { configName: 'twin' })
