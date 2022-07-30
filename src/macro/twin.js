import { MacroError } from 'babel-plugin-macros'
import {
  setStyledIdentifier,
  setCssIdentifier,
  generateUid,
  getCssAttributeData,
  getJsxAttributes,
} from './lib/astHelpers'
import validateImports from './lib/validateImports'
import {
  updateCssReferences,
  addCssImport,
  convertHtmlElementToStyled,
} from './css'
import {
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
// eslint-disable-next-line import/no-relative-parent-imports
import { createCoreContext } from '../core'

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

function twinMacro(params) {
  const t = params.babel.types
  let { state } = params
  const program = state.file.path

  validateImports(params.references)

  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    false

  const coreContext = createCoreContext({
    isDev,
    config: params.config,
    filename: params.state.filename,
    sourceRoot: params.state.file.opts.sourceRoot,
    CustomError: MacroError,
  })

  state = {
    ...state,
    isDev,
    isProd: !isDev,
    tailwindConfigIdentifier: generateUid('tailwindConfig', program),
    tailwindUtilsIdentifier: generateUid('tailwindUtils', program),
    styledIdentifier: null,
    cssIdentifier: null,
  }

  const handlerParameters = { t, program, state, coreContext }

  program.traverse({
    ImportDeclaration(path) {
      setStyledIdentifier({ ...handlerParameters, path })
      setCssIdentifier({ ...handlerParameters, path })
    },
    JSXElement(path) {
      const jsxAttributes = getJsxAttributes(path)
      const { index, hasCssAttribute } = getCssAttributeData(jsxAttributes)
      state.hasCssAttribute = state.hasCssAttribute || hasCssAttribute
      const attributePaths = index > 1 ? jsxAttributes.reverse() : jsxAttributes
      for (path of attributePaths) {
        handleClassNameProperty({ ...handlerParameters, path })
        handleTwProperty({ ...handlerParameters, path })
        handleCsProperty({ ...handlerParameters, path })
      }

      if (hasCssAttribute)
        convertHtmlElementToStyled({ ...handlerParameters, path })
    },
  })

  if (state.styledIdentifier === null)
    state.styledIdentifier = generateUid('styled', program)

  if (state.cssIdentifier === null)
    state.cssIdentifier = generateUid('css', program)

  for (const task of macroTasks) {
    task({ ...handlerParameters, references: params.references })
  }

  program.scope.crawl()
}

export default twinMacro
