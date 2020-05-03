import deepMerge from 'lodash.merge'
import { assert, isEmpty, getProperties, getPieces, getTheme } from './utils'
import { astify } from './macroHelpers'
import doPrechecks, { precheckGroup } from './prechecks'
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

// TODO: Remove 't' param
export default (classes, t, state) => {
  // Move and sort the responsive items to the end of the list
  const classesOrdered = orderByScreens(classes, state)
  const theme = getTheme(state.config.theme)
  const hasUserPlugins = !isEmpty(state.config.plugins)

  // Merge styles into a single css object
  const styles = classesOrdered.reduce((results, classNameRaw) => {
    doPrechecks([precheckGroup], { classNameRaw })

    const pieces = getPieces({ className: classNameRaw, state })
    const { className, negative } = pieces

    // Process addUtilities from plugins
    if (hasUserPlugins) {
      const style = handleUserPlugins({ config: state.config, className })
      if (!isEmpty(style)) {
        state.debug && debug(className, style)
        return deepMerge(results, style)
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
          configTheme: theme(),
          prefix: negative,
        }),
      })
    )

    const { dynamicKey, dynamicConfig, corePlugin, type } = classProperties

    const styleHandler = {
      static: () => handleStatic({ pieces }),
      dynamic: () =>
        handleDynamic({ theme, pieces, state, dynamicKey, dynamicConfig }),
      corePlugin: () =>
        handleCorePlugins({ theme, pieces, state, corePlugin, classNameRaw }),
    }

    const style = applyTransforms({ type, pieces, style: styleHandler[type]() })
    state.debug && debug(className, style)

    return deepMerge(
      results,
      pieces.hasVariants ? addVariants({ results, style, pieces }) : style
    )
  }, {})

  return astify(isEmpty(styles) ? {} : styles, t)
}
