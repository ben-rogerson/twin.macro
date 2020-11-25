import { createMacro } from 'babel-plugin-macros'
import {
  validateImports,
  setStyledIdentifier,
  setCssIdentifier,
  generateUid,
} from './macroHelpers'
import { isEmpty } from './utils'
import {
  getConfigTailwindProperties,
  getConfigTwinValidated,
} from './configHelpers'
import {
  getCssConfig,
  updateCssReferences,
  addCssImport,
  maybeAddCssProperty,
} from './macro/css'
import {
  getStyledConfig,
  updateStyledReferences,
  addStyledImport,
} from './macro/styled'
import { handleThemeFunction } from './macro/theme'
import { handleGlobalStylesFunction } from './macro/GlobalStyles'
import { handleTwProperty, handleTwFunction } from './macro/tw'
import getUserPluginData from './utils/getUserPluginData'
import { debugPlugins } from './logging'

const getPackageUsed = ({ config: { preset }, cssImport, styledImport }) => ({
  isEmotion: preset === 'emotion' || cssImport.from.includes('emotion'),
  isStyledComponents:
    preset === 'styled-components' ||
    cssImport.from.includes('styled-components'),
  isGoober:
    preset === 'goober' ||
    styledImport.from.includes('goober') ||
    cssImport.from.includes('goober'),
})

const twinMacro = ({ babel: { types: t }, references, state, config }) => {
  validateImports(references)

  const program = state.file.path

  /* eslint-disable-next-line unicorn/prevent-abbreviations */
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    false
  state.isDev = isDev
  state.isProd = !isDev

  const { configExists, configTailwind } = getConfigTailwindProperties(
    state,
    config
  )

  // Get import presets
  const styledImport = getStyledConfig(config)
  const cssImport = getCssConfig(config)

  // Identify the css-in-js library being used
  const packageUsed = getPackageUsed({ config, cssImport, styledImport })
  for (const [key, value] of Object.entries(packageUsed)) state[key] = value

  const configTwin = getConfigTwinValidated(config, state)

  state.configExists = configExists
  state.config = configTailwind
  state.configTwin = configTwin

  state.tailwindConfigIdentifier = generateUid('tailwindConfig', program)
  state.tailwindUtilsIdentifier = generateUid('tailwindUtils', program)

  state.debug = isDev ? Boolean(config.debug) : false

  state.userPluginData = getUserPluginData({ config: state.config })
  isDev &&
    Boolean(config.debugPlugins) &&
    state.userPluginData &&
    debugPlugins(state.userPluginData)

  state.styledImport = styledImport
  state.cssImport = cssImport

  // Init identifiers
  state.styledIdentifier = null
  state.cssIdentifier = null

  // Group traversals together for better performance
  program.traverse({
    ImportDeclaration(path) {
      setStyledIdentifier({ state, path, styledImport })
      setCssIdentifier({ state, path, cssImport })
    },
    JSXAttribute(path) {
      handleTwProperty({ path, t, state })
    },
  })

  if (state.styledIdentifier === null) {
    state.styledIdentifier = generateUid('styled', program)
  } else {
    state.existingStyledIdentifier = true
  }

  if (state.cssIdentifier === null) {
    state.cssIdentifier = generateUid('css', program)
  } else {
    state.existingCssIdentifier = true
  }

  handleTwFunction({ references, t, state })

  state.isImportingCss =
    !isEmpty(references.css) && !state.existingCssIdentifier

  // GlobalStyles import
  handleGlobalStylesFunction({ references, program, t, state, config })

  // Css import
  updateCssReferences(references.css, state)
  if (state.isImportingCss) {
    addCssImport({ program, t, cssImport, state })
  }

  // Styled import
  updateStyledReferences(references.styled, state)
  if (!isEmpty(references.styled)) state.shouldImportStyled = true
  if (state.shouldImportStyled && !state.existingStyledIdentifier) {
    addStyledImport({ program, t, styledImport, state })
  }

  // Theme import
  handleThemeFunction({ references, t, state })

  // Auto add css prop for styled-components
  if (
    (state.hasTwProp || state.hasCssProp) &&
    configTwin.autoCssProp === true &&
    state.isStyledComponents
  ) {
    maybeAddCssProperty({ program, t })
  }

  program.scope.crawl()
}

export default createMacro(twinMacro, { configName: 'twin' })
