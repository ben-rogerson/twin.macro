// eslint-disable-next-line import/no-relative-parent-imports
import { createCoreContext } from '../core'
import { MacroError } from 'babel-plugin-macros'
import type { MacroParams } from 'babel-plugin-macros'
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
import type { State } from './types'

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

function twinMacro(params: MacroParams): void {
  const t = params.babel.types
  const program = params.state.file.path

  validateImports(params.references)

  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    false

  const coreContext = createCoreContext({
    isDev,
    config: params.config as undefined,
    filename: params.state.filename ?? '',
    sourceRoot: params.state.file.opts.sourceRoot ?? '',
    CustomError: MacroError as typeof Error,
  })

  const state: State = {
    isDev,
    babel: params.babel,
    config: params.config,
    tailwindConfigIdentifier: generateUid('tailwindConfig', program),
    tailwindUtilsIdentifier: generateUid('tailwindUtils', program),
    styledIdentifier: undefined,
    cssIdentifier: undefined,
    hasCssAttribute: false,
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
      for (const path of attributePaths) {
        handleClassNameProperty({ ...handlerParameters, path })
        handleTwProperty({ ...handlerParameters, path })
        handleCsProperty({ ...handlerParameters, path })
      }

      if (hasCssAttribute)
        convertHtmlElementToStyled({ ...handlerParameters, path })
    },
  })

  if (state.styledIdentifier === undefined)
    state.styledIdentifier = generateUid('styled', program)

  if (state.cssIdentifier === undefined)
    state.cssIdentifier = generateUid('css', program)

  for (const task of macroTasks) {
    // @ts-expect-error TOFIX: Adjust types for altered state
    task({ ...handlerParameters, references: params.references })
  }

  program.scope.crawl()
}

export default twinMacro
