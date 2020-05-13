import dlv from 'dlv'
import { MacroError } from 'babel-plugin-macros'
import { logNotAllowed, errorSuggestions } from '../logging'
import getConfigValue from './../utils/getConfigValue'
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

export default ({
  corePlugin,
  classNameRaw,
  pieces,
  state,
  dynamicKey,
  ...rest
}) => {
  const errors = getErrors({ state, pieces, dynamicKey })
  const match = regex => dlv(pieces.className.match(regex), [0]) || null
  const context = {
    state: () => state,
    errors,
    pieces,
    match,
    getConfigValue,
    ...rest,
  }

  return callPlugin(corePlugin, context)
}
