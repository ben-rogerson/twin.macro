import deepMerge from 'lodash.merge'
import { assert, isEmpty, getProperties, getTheme } from './utils'
import getPieces from './utils/getPieces'
import { astify } from './macroHelpers'
import doPrechecks, { precheckGroup } from './prechecks'
import {
  logGeneralError,
  errorSuggestions,
  logNotFoundVariant,
  logNotFoundClass,
  debug,
} from './logging'
import { orderByScreens } from './screens'
import applyTransforms from './transforms'
import { addVariants, handleVariantGroups } from './variants'
import {
  handleUserPlugins,
  handleCorePlugins,
  handleStatic,
  handleDynamic,
} from './handlers'

export default (classes, t, state) => {
  assert([null, 'null', undefined].includes(classes), () =>
    logGeneralError(
      'Only plain strings can be used with "tw".\nRead more at https://twinredirect.page.link/template-literals'
    )
  )

  // Strip pipe dividers " | "
  classes = classes.replace(/ \| /g, ' ')

  // Unwrap grouped variants
  classes = handleVariantGroups(classes)

  // Move and sort the responsive items to the end of the list
  const classesOrdered = orderByScreens(classes, state)

  const theme = getTheme(state.config.theme)

  // Merge styles into a single css object
  const styles = classesOrdered.reduce((results, classNameRaw) => {
    doPrechecks([precheckGroup], { classNameRaw })

    const pieces = getPieces({ classNameRaw, state })
    const { className, hasVariants } = pieces

    assert(!className, () =>
      hasVariants ? logNotFoundVariant({ classNameRaw }) : logNotFoundClass
    )

    const {
      hasMatches,
      hasUserPlugins,
      dynamicKey,
      dynamicConfig,
      corePlugin,
      type,
    } = getProperties(className, state)

    // Kick off suggestions when no class matches
    assert(!hasMatches && !hasUserPlugins, () =>
      errorSuggestions({ pieces, state })
    )

    const styleHandler = {
      static: () => handleStatic({ pieces }),
      dynamic: () =>
        handleDynamic({ theme, pieces, state, dynamicKey, dynamicConfig }),
      userPlugin: () => handleUserPlugins({ state, className }),
      corePlugin: () =>
        handleCorePlugins({
          theme,
          pieces,
          state,
          corePlugin,
          classNameRaw,
          dynamicKey,
        }),
    }

    let style

    if (hasUserPlugins) {
      style = applyTransforms({
        type,
        pieces,
        style: styleHandler.userPlugin(),
      })
    }

    // Check again there are no userPlugin matches
    assert(!hasMatches && !style, () => errorSuggestions({ pieces, state }))

    style =
      style || applyTransforms({ type, pieces, style: styleHandler[type]() })

    const result = deepMerge(
      results,
      pieces.hasVariants ? addVariants({ results, style, pieces }) : style
    )

    state.debug && debug(classNameRaw, style)

    return result
  }, {})

  return astify(isEmpty(styles) ? {} : styles, t)
}
