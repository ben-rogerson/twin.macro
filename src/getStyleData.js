import deepMerge from 'lodash.merge'
import { throwIf, isEmpty, getTheme } from './utils'
import { getProperties } from './getProperties'
import { astify } from './macroHelpers'
import * as precheckExports from './prechecks'
import * as ordering from './ordering'
import * as pieces from './pieces'
import {
  logGeneralError,
  errorSuggestions,
  logNotFoundVariant,
  logNotFoundClass,
  debugSuccess,
  logBadGood,
} from './logging'
import { addContentClass } from './content'
import applyTransforms from './transforms'
import { addVariants, handleVariantGroups } from './variants'
import {
  handleUserPlugins,
  handleDynamic,
  handleShortCss,
  handleArbitraryCss,
} from './handlers'

const getPieces = context => {
  const results = Object.values(pieces).reduce(
    (results, splitter) => ({ ...results, ...splitter(results) }),
    context
  )
  delete results.state
  return results
}

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
  classes => classes.replace(/ \| /g, ' '),
  // Strip multiline comments
  classes =>
    classes.replace(/(?<!\/)\/(?!\/)\*[\S\s]*?\*\//g, multilineReplaceWith),
  // Strip singleline comments
  classes => classes.replace(/\/\/.*/g, ''),
  // Unwrap grouped variants
  handleVariantGroups,
  // Move some properties to the front of the list so they work as expected
  ...Object.values(ordering),
  // Add a missing content class for after:/before: variants
  addContentClass,
]

export default (classes, args) => {
  const { isCsOnly = false, silentMismatches = false, t, state } = args

  const hasEmptyClasses = [null, 'null', undefined].includes(classes)
  if (silentMismatches && hasEmptyClasses) return
  throwIf(hasEmptyClasses, () =>
    logGeneralError(
      'Only plain strings can be used with "tw".\nRead more at https://twinredirect.page.link/template-literals'
    )
  )

  for (const task of formatTasks) {
    classes = task(classes, state)
  }

  const theme = getTheme(state.config.theme)

  const classesMatched = []
  const classesMismatched = []

  // Merge styles into a single css object
  const styles = classes.reduce((results, classNameRaw) => {
    const pieces = getPieces({ classNameRaw, state })
    const { hasPrefix, className, hasVariants } = pieces

    // Avoid prechecks on silent mode as they'll error loudly
    if (!silentMismatches) {
      const { default: doPrechecks, ...prechecks } = precheckExports
      const precheckContext = { pieces, classNameRaw, state }
      doPrechecks(Object.values(prechecks), precheckContext)
    }

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

    const { hasMatches, hasUserPlugins, corePluginName, coreConfig, type } =
      getProperties(className, state, { isCsOnly })

    if (silentMismatches && !hasMatches && !hasUserPlugins) {
      classesMismatched.push(classNameRaw)
      return results
    }

    // Error if short css is used and disabled
    const isShortCssDisabled =
      state.configTwin.disableShortCss && type === 'shortCss' && !isCsOnly
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

    const styleContext = {
      theme,
      pieces,
      state,
      className,
      classNameRaw,
      corePluginName,
      coreConfig,
      configTwin: state.configTwin,
    }

    const styleHandler = {
      shortCss: handleShortCss,
      dynamic: handleDynamic,
      arbitraryCss: handleArbitraryCss,
      userPlugin: handleUserPlugins,
    }

    let style

    if (hasUserPlugins) {
      style = applyTransforms({
        type,
        pieces,
        style: styleHandler.userPlugin(styleContext),
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
      style ||
      applyTransforms({ pieces, style: styleHandler[type](styleContext) })

    const result = deepMerge(
      results,
      addVariants({ results, style, pieces, state })
    )

    state.debug(debugSuccess(classNameRaw, style))

    classesMatched.push(classNameRaw)
    return result
  }, {})

  return {
    astStyles: astify(isEmpty(styles) ? {} : styles, t),
    mismatched: classesMismatched.join(' '),
    matched: classesMatched.join(' '),
  }
}
