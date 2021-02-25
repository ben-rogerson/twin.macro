import deepMerge from 'lodash.merge'
import { throwIf, isEmpty, getTheme } from './utils'
import getProperties from './getProperties'
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
  handleCss,
} from './handlers'

const formatTasks = [
  // Strip pipe dividers " | "
  ({ classes }) => classes.replace(/ \| /g, ' '),
  // Strip comments
  ({ classes }) => classes.replace(/\/\*[\S\s]*\*\//g, ''), // Multiline
  ({ classes }) => classes.replace(/\/\/.*/g, ''), // Singleline
  // Unwrap grouped variants
  ({ classes }) => handleVariantGroups(classes),
  // Move and sort the responsive items to the end of the list
  ({ classes, state }) => orderByScreens(classes, state),
]

export default (
  classes,
  { isCsOnly = false, silentMismatches = false, t, state } = {}
) => {
  const hasEmptyClasses = [null, 'null', undefined].includes(classes)
  if (silentMismatches && hasEmptyClasses) return
  throwIf(hasEmptyClasses, () =>
    logGeneralError(
      'Only plain strings can be used with "tw".\nRead more at https://twinredirect.page.link/template-literals'
    )
  )

  for (const task of formatTasks) {
    classes = task({ classes, state })
  }

  const theme = getTheme(state.config.theme)

  const classesMatched = []
  const classesMismatched = []

  // Merge styles into a single css object
  const styles = classes.reduce((results, classNameRaw) => {
    // Avoid prechecks on silent mode as they'll error loudly
    !silentMismatches && doPrechecks([precheckGroup], { classNameRaw })

    const pieces = getPieces({ classNameRaw, state })
    const { className, hasVariants } = pieces
    const { configTwin } = state

    if (silentMismatches && !className) {
      classesMismatched.push(classNameRaw)
      return results
    }

    throwIf(!className, () =>
      hasVariants ? logNotFoundVariant({ classNameRaw }) : logNotFoundClass
    )

    const {
      hasMatches,
      hasUserPlugins,
      dynamicKey,
      dynamicConfig,
      corePlugin,
      type,
    } = getProperties(className, state, { isCsOnly })

    if (silentMismatches && !hasMatches && !hasUserPlugins) {
      classesMismatched.push(classNameRaw)
      return results
    }

    // Kick off suggestions when no class matches
    throwIf(!hasMatches && !hasUserPlugins, () =>
      errorSuggestions({ pieces, state, isCsOnly })
    )

    const styleHandler = {
      static: () => handleStatic({ pieces }),
      dynamic: () =>
        handleDynamic({ theme, pieces, state, dynamicKey, dynamicConfig }),
      css: () => handleCss({ className }),
      userPlugin: () => handleUserPlugins({ state, className }),
      corePlugin: () =>
        handleCorePlugins({
          theme,
          pieces,
          state,
          configTwin,
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
    if (silentMismatches && !hasMatches && !style) {
      classesMismatched.push(classNameRaw)
      return results
    }

    throwIf(!hasMatches && !style, () =>
      errorSuggestions({ pieces, state, isCsOnly })
    )

    style =
      style || applyTransforms({ type, pieces, style: styleHandler[type]() })

    const result = deepMerge(
      results,
      pieces.hasVariants ? addVariants({ results, style, pieces }) : style
    )

    state.configTwin.debug && debug(classNameRaw, style)

    classesMatched.push(classNameRaw)
    return result
  }, {})

  return {
    // TODO: Avoid astifying here, move it outside function
    styles: astify(isEmpty(styles) ? {} : styles, t),
    mismatched: classesMismatched.join(' '),
    matched: classesMatched.join(' '),
  }
}
