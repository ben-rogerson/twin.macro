import { MacroError } from 'babel-plugin-macros'
// eslint-disable-next-line import/no-relative-parent-imports
import { getTailwindConfig, getConfigTwinValidated } from '../core'
import createTheme from './lib/createTheme'
import createAssert from './lib/createAssert'
import { createContext } from './lib/util/twImports'
import { createDebug } from './lib/logging'

import {
  setStyledIdentifier,
  setCssIdentifier,
  generateUid,
  getCssAttributeData,
} from './lib/astHelpers'
import validateImports from './lib/validateImports'
import {
  getCssConfig,
  updateCssReferences,
  addCssImport,
  convertHtmlElementToStyled,
} from './css'
import {
  getStyledConfig,
  updateStyledReferences,
  addStyledImport,
  handleStyledFunction,
} from './styled'
import { handleThemeFunction } from './theme'
import { handleScreenFunction } from './screen'
import { handleGlobalStylesFunction } from './globalStyles'
import { handleTwProperty, handleTwFunction } from './tw'
import { handleCsProperty } from './shortCss'
import { handleClassNameProperty } from './className'

const packageCheck = (packageToCheck, params) =>
  params.config.preset === packageToCheck ||
  params.styledImport.from.includes(packageToCheck) ||
  params.cssImport.from.includes(packageToCheck)

const getPackageUsed = params => ({
  isEmotion: packageCheck('emotion', params),
  isStyledComponents: packageCheck('styled-components', params),
  isGoober: packageCheck('goober', params),
  isStitches: packageCheck('stitches', params),
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

const twinMacro = params => {
  const {
    babel: { types: t },
    references,
    config,
  } = params
  let { state } = params

  validateImports(references)

  const program = state.file.path

  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    false
  state.isDev = isDev
  state.isProd = !isDev

  const tailwindConfig = getTailwindConfig(state, config)

  // Get import presets
  const styledImport = getStyledConfig({ state, config })
  const cssImport = getCssConfig({ state, config })

  const packageUsed = getPackageUsed({ config, cssImport, styledImport })
  const configTwin = getConfigTwinValidated(config, { ...packageUsed, isDev })

  state = {
    ...state,
    packageUsed,
    tailwindConfig,
    assert: createAssert(MacroError, false),
    configTwin,
    tailwindConfigIdentifier: generateUid('tailwindConfig', program),
    tailwindUtilsIdentifier: generateUid('tailwindUtils', program),
    styledImport,
    cssImport,
    styledIdentifier: null,
    cssIdentifier: null,
  }

  const coreContext = {
    configTwin,
    isDev,
    assert: state.assert,
    debug: createDebug(isDev, configTwin),
    theme: createTheme(tailwindConfig),
    context: createContext(tailwindConfig),
    tailwindConfig,
    CustomError: MacroError,
  }

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
        handleClassNameProperty({ path, t, state, coreContext })
        handleTwProperty({ path, t, state, program, coreContext })
        handleCsProperty({ path, t, state, coreContext })
      }

      if (hasCssAttribute)
        convertHtmlElementToStyled({ path, t, program, state })
    },
  })

  if (state.styledIdentifier === null)
    state.styledIdentifier = generateUid('styled', program)

  if (state.cssIdentifier === null)
    state.cssIdentifier = generateUid('css', program)

  for (const task of macroTasks) {
    task({
      styledImport,
      cssImport,
      references,
      program,
      config,
      state,
      t,
      coreContext,
    })
  }

  program.scope.crawl()
}

export default twinMacro
