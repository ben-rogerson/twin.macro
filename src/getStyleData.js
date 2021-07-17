import deepMerge from 'lodash.merge'
import { throwIf, isEmpty, getTheme } from './utils'
import { getProperties } from './getProperties'
import getPieces from './utils/getPieces'
import { astify } from './macroHelpers'
import doPrechecks, {
  precheckGroup,
  preCheckPrefix,
  preCheckNoHyphenSuffix,
} from './prechecks'
import {
  logGeneralError,
  errorSuggestions,
  logNotFoundVariant,
  logNotFoundClass,
  debug,
  logBadGood,
} from './logging'
import { orderByScreens } from './screens'
import { orderGridProperty } from './grid'
import { orderTransitionProperty } from './transition'
import { orderTransformProperty } from './transform'
import { orderRingProperty } from './ring'
import { orderBackdropProperty } from './backdrop'
import { orderFilterProperty } from './filter'
import applyTransforms from './transforms'
import { addVariants, handleVariantGroups } from './variants'
import {
  handleUserPlugins,
  handleCorePlugins,
  handleStatic,
  handleDynamic,
  handleCss,
  handleArbitraryCss,
} from './handlers'

// When removing a multiline comment, determine if a space is left or not
// eg: You'd want a space left in this situation: tw`class1/* comment */class2`
const multilineReplaceWith = (match, index, input) => {
  const charBefore = input[index - 1]
  const directPrefixMatch = charBefore && charBefore.match(/\w/)
  const charAfter = input[Number(index) + Number(match.length)]
  const directSuffixMatch = charAfter && charAfter.match(/\w/)
  return directPrefixMatch &&
    directPrefixMatch[0] &&
    directSuffixMatch &&
    directSuffixMatch[0]
    ? ' '
    : ''
}

const formatTasks = [
  // Strip pipe dividers " | "
  ({ classes }) => classes.replace(/ \| /g, ' '),
  // Strip multiline comments
  ({ classes }) =>
    classes.replace(/(?<!\/)\/(?!\/)\*[\S\s]*?\*\//g, multilineReplaceWith),
  // Strip singleline comments
  ({ classes }) => classes.replace(/\/\/.*/g, ''),
  // Unwrap grouped variants
  ({ classes }) => handleVariantGroups(classes),
  // Move some properties to the front of the list so they work as expected
  ({ classes }) => orderGridProperty(classes),
  ({ classes }) => orderTransitionProperty(classes),
  ({ classes }) => orderTransformProperty(classes),
  ({ classes }) => orderRingProperty(classes),
  ({ classes }) => orderBackdropProperty(classes),
  ({ classes }) => orderFilterProperty(classes),
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
    const pieces = getPieces({ classNameRaw, state })
    const { hasPrefix, className, hasVariants } = pieces

    // Avoid prechecks on silent mode as they'll error loudly
    !silentMismatches &&
      doPrechecks([precheckGroup, preCheckPrefix, preCheckNoHyphenSuffix], {
        pieces,
        classNameRaw,
        state,
      })

    // Make sure non-prefixed classNames are ignored
    const { prefix } = state.config
    const hasPrefixMismatch = prefix && !hasPrefix && className
    if (silentMismatches && (!className || hasPrefixMismatch)) {
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

    // Error if short css is used and disabled
    const isShortCssDisabled =
      state.configTwin.disableShortCss && type === 'css' && !isCsOnly
    throwIf(isShortCssDisabled, () =>
      logBadGood(
        `Short css has been disabled in the config so “${classNameRaw}” won’t work${
          !state.configTwin.disableCsProp ? ' outside the cs prop' : ''
        }.`,
        !state.configTwin.disableCsProp
          ? `Add short css with the cs prop: &lt;div cs="${classNameRaw}" /&gt;`
          : ''
      )
    )

    // Kick off suggestions when no class matches
    throwIf(!hasMatches && !hasUserPlugins, () =>
      errorSuggestions({ pieces, state, isCsOnly })
    )

    const styleHandler = {
      static: () => handleStatic({ pieces }),
      dynamic: () =>
        handleDynamic({ theme, pieces, state, dynamicKey, dynamicConfig }),
      css: () => handleCss({ className }),
      arbitraryCss: () => handleArbitraryCss({ className, pieces }),
      userPlugin: () => handleUserPlugins({ state, className }),
      corePlugin: () =>
        handleCorePlugins({
          theme,
          pieces,
          state,
          corePlugin,
          classNameRaw,
          dynamicKey,
          configTwin: state.configTwin,
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
      addVariants({ results, style, pieces, state })
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
