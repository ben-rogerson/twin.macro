import { MacroError } from 'babel-plugin-macros'
import { logNotAllowed, errorSuggestions } from '../logging'
import getConfigValue from './../utils/getConfigValue'
import { get, withAlpha } from './../utils'
/* eslint import/namespace: [2, { allowComputed: true }] */
/* eslint-disable-next-line unicorn/import-index */
import * as plugins from '../plugins/index'

const getErrors = ({ pieces, state, dynamicKey }) => {
  const { className, variants } = pieces
  return {
    errorSuggestions: options => {
      throw new MacroError(
        errorSuggestions({ pieces, state, dynamicKey, ...options })
      )
    },
    errorNoVariants: () => {
      throw new MacroError(
        logNotAllowed({
          className,
          error: `doesn’t support ${variants
            .map(variant => `${variant}:`)
            .join('')} or any other variants`,
        })
      )
    },
    errorNoImportant: () => {
      throw new MacroError(
        logNotAllowed({
          className,
          error: `doesn’t support !important`,
        })
      )
    },
    errorNoNegatives: () => {
      throw new MacroError(
        logNotAllowed({
          className,
          error: `doesn’t support negatives`,
        })
      )
    },
  }
}

const callPlugin = (corePlugin, context) => {
  const handle = plugins[corePlugin] || null
  if (!handle) {
    throw new MacroError(`No handler specified, looked for "${corePlugin}"`)
  }

  return handle(context)
}

const getColor = ({ configTwin, matchConfigValue, pieces }) => colors => {
  let result
  colors.find(
    ({
      matchStart,
      property,
      configSearch,
      opacityVariable,
      useSlashAlpha,
    }) => {
      // Disable slash alpha matching when a variable is supplied.
      // For classes that use opacity classes 'bg-opacity-50'.
      if (useSlashAlpha === undefined) {
        useSlashAlpha = !opacityVariable
      }

      const color = matchConfigValue(
        configSearch,
        `(?<=(${matchStart}-))([^]*)${useSlashAlpha ? `(?=/)` : ''}`
      )
      if (!color) return false

      // Avoid using --tw-xxx variables if color variables are disabled
      if (configTwin.disableColorVariables) {
        useSlashAlpha = true
      }

      const newColor = withAlpha({
        pieces,
        property,
        variable: opacityVariable,
        useSlashAlpha,
        color,
      })
      if (newColor) result = newColor
      return newColor
    }
  )
  return result
}

const getMatchConfigValue = ({ match, theme, getConfigValue }) => (
  config,
  regexMatch
) => {
  const matcher = match(regexMatch)
  if (!matcher) return
  return getConfigValue(theme(config), matcher)
}

export default ({
  corePlugin,
  classNameRaw,
  pieces,
  state,
  dynamicKey,
  theme,
  configTwin,
  ...rest
}) => {
  const errors = getErrors({ state, pieces, dynamicKey })
  const match = regex => get(pieces.className.match(regex), [0]) || null

  const matchConfigValue = getMatchConfigValue({ match, theme, getConfigValue })
  const toColor = getColor({ configTwin, matchConfigValue, pieces })

  const context = {
    state: () => state,
    errors,
    pieces,
    match,
    theme,
    toColor,
    configTwin,
    getConfigValue,
    matchConfigValue,
    ...rest,
  }

  return callPlugin(corePlugin, context)
}
