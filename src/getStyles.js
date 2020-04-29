import deepMerge from 'lodash.merge'
import { assert, isEmpty, getProperties, getPieces } from './utils'
import { astify } from './macroHelpers'
import doPrechecks, { precheckGroup, precheckTrailingSlash } from './prechecks'
import { logNoClass, softMatchConfigs } from './logging'
import { orderByScreens } from './screens'
import { debug } from './logging'
import applyTransforms from './transforms'
import { addVariants } from './variants'
import {
  handleUserPlugins,
  handleCorePlugins,
  handleStatic,
  handleDynamic,
} from './handlers'

const getStyles = (input, t, state) => {
  // Move and sort the responsive items to the end of the list
  const rawClassList = orderByScreens(input, state)

  // Merge styles into a single css object
  const styles = rawClassList.reduce((accumulator, classNameRaw) => {
    doPrechecks([precheckGroup, precheckTrailingSlash], { classNameRaw })

    const pieces = getPieces({ className: classNameRaw, state })
    const { className, negative } = pieces

    // Process addUtilities from plugins
    const hasUserPlugins = !isEmpty(state.config.plugins)
    if (hasUserPlugins) {
      const style = handleUserPlugins({ config: state.config, className })
      if (!isEmpty(style)) {
        state.debug && debug(className, style)
        return deepMerge(accumulator, style)
      }
    }

    const classProperties = getProperties(className)

    // Kick off suggestions when no class matches
    assert(
      classProperties.hasNoMatches,
      logNoClass({
        className: `${negative}${className}`,
        hasSuggestions: state.hasSuggestions,
        config: softMatchConfigs({
          className,
          configTheme: state.config.theme,
          prefix: negative,
        }),
      })
    )

    const { dynamicKey, dynamicStyleset, corePlugin, type } = classProperties

    const styleHandler = {
      static: () => handleStatic({ pieces }),
      dynamic: () =>
        handleDynamic({ pieces, state, dynamicKey, dynamicStyleset }),
      corePlugin: () =>
        handleCorePlugins({ pieces, state, corePlugin, classNameRaw }),
    }

    const style = applyTransforms({ type, pieces, style: styleHandler[type]() })
    state.debug && debug(className, style)

    return deepMerge(
      accumulator,
      pieces.hasVariants ? addVariants({ style, accumulator, pieces }) : style
    )
  }, {})

  return astify(isEmpty(styles) ? {} : styles, t)
}

export { getStyles as default }
