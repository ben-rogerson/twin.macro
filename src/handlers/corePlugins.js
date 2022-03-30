import { MacroError } from 'babel-plugin-macros'
import { logNotAllowed, errorSuggestions } from '../logging'
import getConfigValue from './../utils/getConfigValue'
import { get } from './../utils'
import { getColor } from './../utils/color'
/* eslint import/namespace: [2, { allowComputed: true }] */
/* eslint-disable-next-line unicorn/import-index */
import * as plugins from '../plugins/index'
import { getCoerced } from './../coerced'

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
  if (typeof corePlugin === 'function') {
    return corePlugin(context)
  }

  const handle = plugins[corePlugin] || null
  if (!handle) {
    throw new MacroError(`No handler specified, looked for "${corePlugin}"`)
  }

  return handle(context)
}

// Legacy
const getMatchConfigValue = ({ match, theme }) => (config, regexMatch) => {
  const matcher = match(regexMatch)
  if (matcher === undefined) return
  return getConfigValue(theme(config), matcher)
}

// Direct match
const getMatchConfig = ({ match, theme, dynamicKey }) => config => {
  const directMatch = match(`(?<=${dynamicKey}(-|$))(.)*`)
  if (directMatch === undefined) return

  return getConfigValue(theme(config), directMatch)
}

export default ({
  corePlugin,
  classNameRaw,
  pieces,
  state,
  dynamicKey,
  theme,
  configTwin,
  dynamicConfig,
  ...rest
}) => {
  const errors = getErrors({ state, pieces, dynamicKey })
  const match = regex => {
    const result = get(pieces.classNameNoSlashAlpha.match(regex), [0])
    if (result === undefined) return
    return result
  }

  const matchConfigValue = getMatchConfigValue({ match, theme })
  const matchConfig = getMatchConfig({ match, theme, dynamicKey })

  const toColor = getColor({
    theme,
    getConfigValue,
    matchConfigValue,
    pieces,
  })

  const coercedConfig = dynamicConfig.coerced || {}

  const context = {
    state: () => state,
    errors,
    pieces,
    match,
    theme,
    toColor,
    configTwin,
    getConfigValue,
    matchConfigValue, // Legacy
    matchConfig,
    dynamicKey,
    dynamicConfig,
    getCoerced: getCoerced({
      config: coercedConfig,
      pieces,
      theme,
      matchConfig,
    }),
    ...rest,
  }

  return callPlugin(corePlugin, context)
}
