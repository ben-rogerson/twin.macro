import { createMacro } from 'babel-plugin-macros'
import {
  validateImports,
  setStyledIdentifier,
  setCssIdentifier,
  generateUid,
  getCssAttributeData,
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
import { handleScreenFunction } from './macro/screen'
import { handleGlobalStylesFunction } from './macro/globalStyles'
import { handleTwProperty, handleTwFunction } from './macro/tw'
import { handleCsProperty } from './macro/cs'
import { handleClassNameProperty } from './macro/className'
import getUserPluginData from './utils/getUserPluginData'
import { debugPlugins } from './logging'

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
})

const twinMacro = ({ babel: { types: t }, references, state, config }) => {
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
  const styledImport = getStyledConfig(config)
  const cssImport = getCssConfig(config)

  // Identify the css-in-js library being used
  const packageUsed = getPackageUsed({ config, cssImport, styledImport })
  for (const [key, value] of Object.entries(packageUsed)) state[key] = value

  const configTwin = getConfigTwinValidated(config, state)

  state.configExists = configExists
  state.config = configTailwind
  state.configTwin = configTwin
  state.globalStyles = new Map()

  state.tailwindConfigIdentifier = generateUid('tailwindConfig', program)
  state.tailwindUtilsIdentifier = generateUid('tailwindUtils', program)

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
    JSXElement(path) {
      const allAttributes = path.get('openingElement.attributes')
      const jsxAttributes = allAttributes.filter(attribute =>
        attribute.isJSXAttribute()
      )
      const { index, hasCssAttribute } = getCssAttributeData(jsxAttributes)
      // Make sure hasCssAttribute remains true once css prop has been found
      // so twin can add the autoCssProp for styled-components
      state.hasCssAttribute = state.hasCssAttribute || hasCssAttribute

      // Reverse the attributes so the items keep their order when replaced
      const orderedAttributes =
        index > 1 ? jsxAttributes.reverse() : jsxAttributes
      for (path of orderedAttributes) {
        handleClassNameProperty({ path, t, state })
        handleTwProperty({ path, t, state })
        handleCsProperty({ path, t, state })
      }
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

  // Styled import
  updateStyledReferences(references.styled, state)
  if (!isEmpty(references.styled)) state.shouldImportStyled = true
  if (state.shouldImportStyled && !state.existingStyledIdentifier) {
    addStyledImport({ program, t, styledImport, state })
  }

  /**
   * Css import
   * Gotcha: The css import must be inserted above the styled import when using
   * styled-components/macro or issues arrise with the way theme`` styles get
   * transpiled. I've placed this under the styled import so the
   * addImport (using unshift container) will add it above correctly.
   */
  updateCssReferences(references.css, state)
  if (state.isImportingCss) {
    addCssImport({ program, t, cssImport, state })
  }

  // Theme import
  handleThemeFunction({ references, t, state })

  // Auto add css prop for styled-components
  if (
    (state.hasTwAttribute || state.hasCssAttribute) &&
    configTwin.autoCssProp === true &&
    state.isStyledComponents
  ) {
    maybeAddCssProperty({ program, t })
  }

  // Screen import
  handleScreenFunction({ references, program, t, state, config })

  program.scope.crawl()
}

export default createMacro(twinMacro, { configName: 'twin' })
