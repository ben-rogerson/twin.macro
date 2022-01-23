import { MacroError } from 'babel-plugin-macros'
import { logNotAllowed, errorSuggestions } from '../logging'
import getConfigValue from './../utils/getConfigValue'
import { get } from './../utils'
import { getColor } from './../utils/color'
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

const getMatchConfigValue = ({ match, theme, getConfigValue }) => (
  config,
  regexMatch
) => {
  const matcher = match(regexMatch)
  if (matcher === undefined) return
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
  const match = regex => {
    const result = get(pieces.className.match(regex), [0])
    if (result === undefined) return
    return result
  }

  const matchConfigValue = getMatchConfigValue({ match, theme, getConfigValue })
  const toColor = getColor({
    theme,
    getConfigValue,
    matchConfigValue,
    pieces,
  })

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
