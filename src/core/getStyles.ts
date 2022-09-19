import extractRuleStyles from './extractRuleStyles'
import createAssert from './lib/createAssert'
import expandVariantGroups from './lib/expandVariantGroups'
import deepMerge from './lib/util/deepMerge'
import { resolveMatches } from './lib/util/twImports'
import escapeRegex from './lib/util/escapeRegex'
import convertClassName from './lib/convertClassName'
import { WORD_CHARACTER, CLASS_SEPARATOR } from './constants'
import type {
  CoreContext,
  CssObject,
  ExtractRuleStyles,
  AssertContext,
  TailwindMatch,
  TailwindContext,
} from './types'

const IMPORTANT_OUTSIDE_BRACKETS =
  /(:!|^!)(?=(?:(?:(?!\)).)*\()|[^()]*$)(?=(?:(?:(?!]).)*\[)|[^[\]]*$)/
const COMMENTS_MULTI_LINE = /(?<!\/)\/(?!\/)\*[\S\s]*?\*\//g
const COMMENTS_SINGLE_LINE = /(?<!:)\/\/.*/g
const CLASS_DIVIDER_PIPE = / \| /g
const SPLIT_AT_SPACE_AVOID_WITHIN_SQUARE_BRACKETS =
  / (?=(?:(?:(?!]).)*\[)|[^[\]]*$)/g

function getStylesFromMatches(
  matches: TailwindMatch[],
  params: ExtractRuleStyles
): CssObject | undefined {
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

  // @ts-expect-error Avoid tuple type error
  return deepMerge(...rulesets)
}

// When removing a multiline comment, determine if a space is left or not
// eg: You'd want a space left in this situation: tw`class1/* comment */class2`
function multilineReplaceWith(
  match: string,
  index: number,
  input: string
): ' ' | '' {
  const charBefore = input[index - 1]
  const directPrefixMatch = charBefore && WORD_CHARACTER.exec(charBefore)
  const charAfter = input[Number(index) + Number(match.length)]
  const directSuffixMatch = charAfter && WORD_CHARACTER.exec(charAfter)
  return directPrefixMatch?.[0] && directSuffixMatch && directSuffixMatch[0]
    ? ' '
    : ''
}

function validateClasses(
  classes: string,
  { assert }: { assert: CoreContext['assert'] }
): boolean {
  assert(
    (classes.match(/\[/g) ?? []).length === (classes.match(/]/g) ?? []).length,
    ({ color }: AssertContext) =>
      `${color(
        `✕ Unbalanced square brackets found in classes:\n\n${color(
          classes,
          'errorLight'
        )}`
      )}`
  )

  const classNames = classes.split(SPLIT_AT_SPACE_AVOID_WITHIN_SQUARE_BRACKETS)

  for (const className of classNames) {
    assert(
      !className.endsWith(':'),
      ({ color }: AssertContext) =>
        `${color(
          `✕ The variant ${String(
            color(className, 'errorLight')
          )} has a space after the colon`
        )}\n\nUpdate to ${String(
          color(`${className}block`, 'success')
        )} or ${String(color(`${className}(block mt-4)`, 'success'))}`
    )
  }

  return true
}

const tasks: Array<(classes: string) => string> = [
  (classes): string => classes.replace(CLASS_DIVIDER_PIPE, ' '),
  (classes): string =>
    classes.replace(COMMENTS_MULTI_LINE, multilineReplaceWith),
  (classes): string => classes.replace(COMMENTS_SINGLE_LINE, ''),
  expandVariantGroups, // Expand grouped variants to individual classes
]

function splitAtSpace(className: string): string[] {
  return className.match(CLASS_SEPARATOR) ?? []
}

function bigSign(bigIntValue: bigint): number {
  // @ts-expect-error Unsure of types here
  return (bigIntValue > 0n) - (bigIntValue < 0n)
}

function getOrderedClassList(
  tailwindContext: TailwindContext,
  convertedClassList: string[],
  classList: string[],
  assert: CoreContext['assert']
): Array<[order: bigint, className: string, preservedClassName: string]> {
  assert(typeof tailwindContext?.getClassOrder === 'function', ({ color }) =>
    color('Twin requires a newer version of tailwindcss, please update')
  ) // `getClassOrder` was added in tailwindcss@3.0.23

  let orderedClassList

  try {
    orderedClassList = tailwindContext
      .getClassOrder(convertedClassList)
      .map(([className, order], index): [bigint, string, string] => [
        order || 0n,
        className,
        classList[index],
      ])
      .sort(([a], [z]) => bigSign(a - z))
  } catch (error: unknown) {
    assert(
      false,
      ({ color }) =>
        `${color(error as string)}\n\nFound in:\n${convertedClassList.join(
          ' '
        )}`
    )
  }

  return orderedClassList as Array<[bigint, string, string]>
}

function getStyles(
  classes: string,
  params: CoreContext
): { styles: CssObject | undefined; unmatched: string[]; matched: string[] } {
  const assert = createAssert(
    params.CustomError,
    params.isSilent,
    params.twinConfig.hasLogColors
  )

  params.debug('string in', classes)

  assert(
    ![null, 'null', undefined].includes(classes),
    ({ color }: AssertContext) =>
      `${color(
        `✕ Your classes need to be complete strings for Twin to detect them correctly`
      )}\n\nRead more at https://twinredirect.page.link/template-literals`
  )

  const result = validateClasses(classes, { assert })
  if (!result) return { styles: undefined, matched: [], unmatched: [] }

  for (const task of tasks) {
    classes = task(classes)
  }

  params.debug('classes after format', classes)

  const matched: string[] = []
  const unmatched: string[] = []
  const styles: CssObject[] = []

  const commonContext = {
    assert,
    theme: params.theme,
    debug: params.debug,
  }

  const convertedClassNameContext = {
    ...commonContext,
    isShortCssOnly: params.isShortCssOnly,
    disableShortCss: params.twinConfig.disableShortCss,
  }

  const classList = splitAtSpace(classes)

  const convertedClassList = classList.map(c =>
    convertClassName(c, convertedClassNameContext)
  )

  const orderedClassList = getOrderedClassList(
    params.tailwindContext,
    convertedClassList,
    classList,
    assert
  )

  const commonMatchContext = {
    ...commonContext,
    includeUniversalStyles: false,
    tailwindConfig: params.tailwindConfig,
    tailwindContext: params.tailwindContext,
    sassyPseudo: params.twinConfig.sassyPseudo,
  }

  for (const [, convertedClassName, className] of orderedClassList) {
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
      params.debug('No matching rules found', className, 'error')

      unmatched.push(className)

      // If non-match and is on silent mode: Continue next iteration
      if (params.isSilent) continue

      // If non-match: Stop iteration and return
      // (This "for of" loop returns to the parent function)
      return { styles: undefined, matched, unmatched }
    }

    matched.push(className)
    params.debug('✨ ruleset out', results, 'success')

    styles.push(results)
  }

  if (styles.length === 0) return { styles: undefined, matched, unmatched }

  // @ts-expect-error Avoid tuple type error
  const mergedStyles = deepMerge(...styles)

  return { styles: mergedStyles, matched, unmatched }
}

export default getStyles
