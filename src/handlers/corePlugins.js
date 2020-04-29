import dlv from 'dlv'
import { MacroError } from 'babel-plugin-macros'
import { logNoClass, logNotAllowed } from '../logging'
/* eslint import/namespace: [2, { allowComputed: true }] */
/* eslint-disable-next-line unicorn/import-index */
import * as plugins from '../plugins/index'

const getErrors = ({ variants, classNameRaw, className, state }) => ({
  errorNotFound: config => {
    throw new MacroError(
      logNoClass({
        className: classNameRaw,
        hasSuggestions: state.hasSuggestions,
        ...config,
      })
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
})

const callPlugin = (corePlugin, context) => {
  const handle = plugins[corePlugin] || null
  if (!handle) {
    throw new MacroError(`No handler specified, looked for "${corePlugin}"`)
  }

  return handle(context)
}

export default ({ corePlugin, classNameRaw, pieces, state }) => {
  const errors = getErrors({ state, classNameRaw, ...pieces })
  const theme = (grab, sub, theme = dlv(state, 'config.theme')) =>
    grab ? dlv(theme, sub ? [grab, sub] : grab) : theme
  const match = regex => dlv(pieces.className.match(regex), [0]) || null
  const context = { state: () => state, errors, theme, pieces, match }

  return callPlugin(corePlugin, context)
}
