import extractRuleStyles from './extractRuleStyles'
import * as ordering from './lib/ordering'
import createAssert from './lib/createAssert'
import expandVariantGroups from './lib/expandVariantGroups'
import deepMerge from './lib/util/deepMerge'
import { resolveMatches } from './lib/util/twImports'
import escapeRegex from './lib/util/escapeRegex'
import convertClassName from './lib/convertClassName'
import {
  IMPORTANT_OUTSIDE_BRACKETS,
  COMMENTS_MULTI_LINE,
  COMMENTS_SINGLE_LINE,
  CLASS_DIVIDER_PIPE,
} from './constants'

function getStylesFromMatches(matches, params) {
  if (matches.length === 0) {
    params.debug('no matches supplied', {}, 'error')
    return
  }

  const rulesets = matches
    .map(([data, rule]) =>
      extractRuleStyles([rule], { ...params, options: data.options })
    )
    .filter(Boolean)

  if (rulesets.length === 0) {
    params.debug('no node rulesets found', {}, 'error')
    return
  }

  return deepMerge(...rulesets)
}

// When removing a multiline comment, determine if a space is left or not
// eg: You'd want a space left in this situation: tw`class1/* comment */class2`
function multilineReplaceWith(match, index, input) {
  const charBefore = input[index - 1]
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  const directPrefixMatch = charBefore && charBefore.match(/\w/)
  const charAfter = input[Number(index) + Number(match.length)]
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  const directSuffixMatch = charAfter && charAfter.match(/\w/)
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  return directPrefixMatch &&
    directPrefixMatch[0] &&
    directSuffixMatch &&
    directSuffixMatch[0]
    ? ' '
    : ''
}

const formatTasks = [
  classes => classes.replace(CLASS_DIVIDER_PIPE, ' '),
  classes => classes.replace(COMMENTS_MULTI_LINE, multilineReplaceWith),
  classes => classes.replace(COMMENTS_SINGLE_LINE, ''),
  expandVariantGroups, // Expand grouped variants to individual classes
  ...Object.values(ordering), // Move selected properties to the front so styles merge correctly
]

export default (classes, params) => {
  const assert = createAssert(params.CustomError || Error, params.isSilent)

  assert(
    ![null, 'null', undefined].includes(classes),
    'Twin classes must be defined as complete strings\nRead more at https://twinredirect.page.link/template-literals'
  )

  for (const task of formatTasks) {
    classes = task(classes, params)
  }

  const matched = []
  const unmatched = []
  let styles = []

  const convertedClassNameContext = {
    assert,
    theme: params.theme,
    debug: params.debug,
    isShortCssOnly: params.isShortCssOnly,
    disableShortCss: params.twinConfig.disableShortCss,
  }

  const commonMatchContext = {
    assert,
    theme: params.theme,
    debug: params.debug,
    includeUniversalStyles: false,
    tailwindConfig: params.tailwindConfig,
    tailwindContext: params.tailwindContext,
    sassyPseudo: params.twinConfig.sassyPseudo,
  }

  for (const className of classes) {
    params.debug('class before convert', className)

    const convertedClassName = convertClassName(
      className,
      convertedClassNameContext
    )

    const matches = [
      ...resolveMatches(convertedClassName, params.tailwindContext),
    ]

    const results = getStylesFromMatches(matches, {
      ...commonMatchContext,
      hasImportant: IMPORTANT_OUTSIDE_BRACKETS.test(
        escapeRegex(convertedClassName)
      ),
      selectorMatchReg: new RegExp(
        // This regex specifies a list of characters allowed for the character
        // immediately after the class ends - this avoids matching other classes
        // eg: Input 'btn' will avoid matching '.btn-primary' in `.btn + .btn-primary`
        `(${escapeRegex(`.${convertedClassName}`)})(?=[\\[. >~+*:$\\)]|$)`
      ),
    })

    if (!results) {
      unmatched.push(className)
      params.debug('No matching rules found', className, 'error')

      // When non-match and is on silent mode: Continue next iteration
      if (params.isSilent) continue

      // When non-match: Stop iteration and return
      // In this "for of" loop it exits to the parent function too
      return { styles: null, matched, unmatched }
    }

    matched.push(className)
    params.debug('ruleset', results)

    styles.push(results)
  }

  if (styles.length === 0) return { styles: null, matched, unmatched }

  styles = deepMerge(...styles)

  return { styles, matched, unmatched }
}
