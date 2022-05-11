import { createMacro } from 'babel-plugin-macros'
import {
  validateImports,
  setStyledIdentifier,
  setCssIdentifier,
  generateUid,
  getCssAttributeData,
} from './macroHelpers'
import {
  getConfigTailwindProperties,
  getConfigTwinValidated,
} from './configHelpers'
import {
  getCssConfig,
  updateCssReferences,
  addCssImport,
  convertHtmlElementToStyled,
} from './macro/css'
import {
  getStyledConfig,
  updateStyledReferences,
  addStyledImport,
  handleStyledFunction,
} from './macro/styled'
import { handleThemeFunction } from './macro/theme'
import { handleScreenFunction } from './macro/screen'
import { handleGlobalStylesFunction } from './macro/globalStyles'
import { handleTwProperty, handleTwFunction } from './macro/tw'
import { handleCsProperty } from './macro/cs'
import { handleClassNameProperty } from './macro/className'
import getUserPluginData from './utils/getUserPluginData'
import { debugPlugins, debug } from './logging'

const getPackageUsed = ({ config: { preset }, cssImport, styledImport }) => ({
  isEmotion:
    preset === 'emotion' ||
    styledImport.from.includes('emotion') ||
    cssImport.from.includes('emotion'),
  isStyledComponents:
    preset === 'styled-components' ||
    styledImport.from.includes('styled-components') ||
    cssImport.from.includes('styled-components'),
  isGoober:
    preset === 'goober' ||
    styledImport.from.includes('goober') ||
    cssImport.from.includes('goober'),
  isStitches:
    preset === 'stitches' ||
    styledImport.from.includes('stitches') ||
    cssImport.from.includes('stitches'),
})

const macroTasks = [
  handleTwFunction,
  handleGlobalStylesFunction, // GlobalStyles import
  updateStyledReferences, // Styled import
  handleStyledFunction, // Convert tw.div`` & styled.div`` to styled('div', {}) (stitches)
  updateCssReferences, // Update any usage of existing css imports
  handleThemeFunction, // Theme import
  handleScreenFunction, // Screen import
  addStyledImport,
  addCssImport, // Gotcha: Must be after addStyledImport or issues with theme`` style transpile
]

const twinMacro = args => {
  const {
    babel: { types: t },
    references,
    state,
    config,
  } = args

  validateImports(references)

  const program = state.file.path

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
  const styledImport = getStyledConfig({ state, config })
  const cssImport = getCssConfig({ state, config })

  // Identify the css-in-js library being used
  const packageUsed = getPackageUsed({ config, cssImport, styledImport })
  for (const [key, value] of Object.entries(packageUsed)) state[key] = value

  const configTwin = getConfigTwinValidated(config, state)

  state.configExists = configExists
  state.config = configTailwind
  state.configTwin = configTwin
  state.debug = debug(state)
  state.globalStyles = new Map()

  state.tailwindConfigIdentifier = generateUid('tailwindConfig', program)
  state.tailwindUtilsIdentifier = generateUid('tailwindUtils', program)

  state.userPluginData = getUserPluginData({ config: state.config, configTwin })
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
    JSXElement(path) {
      const allAttributes = path.get('openingElement.attributes')
      const jsxAttributes = allAttributes.filter(a => a.isJSXAttribute())
      const { index, hasCssAttribute } = getCssAttributeData(jsxAttributes)
      // Make sure hasCssAttribute remains true once css prop has been found
      // so twin can add the css prop
      state.hasCssAttribute = state.hasCssAttribute || hasCssAttribute

      // Reverse the attributes so the items keep their order when replaced
      const orderedAttributes =
        index > 1 ? jsxAttributes.reverse() : jsxAttributes
      for (path of orderedAttributes) {
        handleClassNameProperty({ path, t, state })
        handleTwProperty({ path, t, state, program })
        handleCsProperty({ path, t, state })
      }

      hasCssAttribute && convertHtmlElementToStyled({ path, t, program, state })
    },
  })

  if (state.styledIdentifier === null)
    state.styledIdentifier = generateUid('styled', program)

  if (state.cssIdentifier === null)
    state.cssIdentifier = generateUid('css', program)

  for (const task of macroTasks) {
    task({ styledImport, cssImport, references, program, config, state, t })
  }

  program.scope.crawl()
}

export default createMacro(twinMacro, { configName: 'twin' })
