import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'
import { splitAtTopLevelOnly } from './util/twImports'
import type { AssertContext, CoreContext, TailwindConfig } from 'core/types'
// eslint-disable-next-line import/no-relative-parent-imports
import { SPACE_ID, SPACES } from '../constants'

const ALL_COMMAS = /,/g
const ALL_AMPERSANDS = /&/g
const ENDING_AMP_THEN_WHITESPACE = /&[\s_]*$/
const ALL_CLASS_DOTS = /(?<!\\)(\.)(?=\w)/g
const ALL_CLASS_ATS = /(?<!\\)(@)(?=\w)(?!media)/g
const ALL_WRAPPABLE_PARENT_SELECTORS = /&(?=([^ $)*+,.:>[_~])[\w-])/g
const BASIC_SELECTOR_TYPES = /^#|^\\.|[^\W_]/

type ConvertShortCssToArbitraryPropertyParameters = {
  disableShortCss: CoreContext['twinConfig']['disableShortCss']
  origClassName: string
} & Pick<CoreContext, 'tailwindConfig' | 'assert' | 'isShortCssOnly'>

function convertShortCssToArbitraryProperty(
  className: string,
  {
    tailwindConfig,
    assert,
    disableShortCss,
    isShortCssOnly,
    origClassName,
  }: ConvertShortCssToArbitraryPropertyParameters
): string {
  const splitArray = [
    ...splitAtTopLevelOnly(className, tailwindConfig.separator ?? ':'),
  ]

  const lastValue = splitArray.slice(-1)[0]

  let [property, value] = splitOnFirst(lastValue, '[')
  value = value.slice(0, -1).trim()

  let preSelector = ''

  if (property.startsWith('!')) {
    property = property.slice(1)
    preSelector = '!'
  }

  const template = `${preSelector}[${[
    property,
    value === '' ? "''" : value,
  ].join(tailwindConfig.separator ?? ':')}]`
  splitArray.splice(-1, 1, template)

  const arbitraryProperty = splitArray.join(tailwindConfig.separator ?? ':')

  const isShortCssDisabled = disableShortCss && !isShortCssOnly
  assert(!isShortCssDisabled, ({ color }) =>
    [
      `${String(
        color(
          `✕ ${String(
            color(origClassName, 'errorLight')
          )} uses twin’s deprecated short-css syntax`
        )
      )}`,
      `Update to ${String(color(arbitraryProperty, 'success'))}`,
      `To ignore this notice, add this to your twin config:\n{ "disableShortCss": false }`,
      `Read more at https://twinredirect.page.link/short-css`,
    ].join('\n\n')
  )

  return arbitraryProperty
}

type ConvertClassNameParameters = {
  disableShortCss: CoreContext['twinConfig']['disableShortCss']
} & Pick<
  CoreContext,
  'tailwindConfig' | 'theme' | 'assert' | 'debug' | 'isShortCssOnly'
>

function checkForVariantSupport({
  className,
  tailwindConfig,
  assert,
}: { className: string } & Pick<
  CoreContext,
  'tailwindConfig' | 'assert'
>): void {
  const pieces = splitAtTopLevelOnly(className, tailwindConfig.separator ?? ':')
  const hasMultipleVariants = pieces.length > 2
  const hasACommaInVariants = pieces.some(p => {
    const splits = splitAtTopLevelOnly(p.slice(1, -1), ',')
    return splits.length > 1
  })
  const hasIssue = hasMultipleVariants && hasACommaInVariants
  assert(
    !hasIssue,
    ({ color }: AssertContext) =>
      `${color(
        `✕ The variants on ${String(
          color(className, 'errorLight')
        )} are invalid tailwind and twin classes`
      )}\n\n${color(
        `To fix, either reduce all variants into a single arbitrary variant:`,
        'success'
      )}\nFrom: \`[.this, .that]:first:block\`\nTo: \`[.this:first, .that:first]:block\`\n\n${color(
        `Or split the class into separate classes instead of using commas:`,
        'success'
      )}\nFrom: \`[.this, .that]:first:block\`\nTo: \`[.this]:first:block [.that]:first:block\`\n\nRead more at https://twinredirect.page.link/arbitrary-variants-with-commas`
  )
}

// Convert a twin class to a tailwindcss friendly class
function convertClassName(
  className: string,
  {
    tailwindConfig,
    theme,
    isShortCssOnly,
    disableShortCss,
    assert,
    debug,
  }: ConvertClassNameParameters
): string {
  checkForVariantSupport({ className, tailwindConfig, assert })

  const origClassName = className

  // Convert spaces to class friendly underscores
  className = className.replace(SPACES, SPACE_ID)

  // Move the bang to the front of the class
  if (className.endsWith('!')) {
    debug('trailing bang found', className)

    const splitArray = [
      ...splitAtTopLevelOnly(
        className.slice(0, -1),
        tailwindConfig.separator ?? ':'
      ),
    ]
    // Place a ! before the class
    splitArray.splice(-1, 1, `!${splitArray[splitArray.length - 1]}`)
    className = splitArray.join(tailwindConfig.separator ?? ':')
  }

  // Convert short css to an arbitrary property, eg: `[display:block]`
  // (Short css is deprecated)
  if (isShortCss(className, tailwindConfig)) {
    debug('short css found', className)
    className = convertShortCssToArbitraryProperty(className, {
      tailwindConfig,
      assert,
      disableShortCss,
      isShortCssOnly,
      origClassName,
    })
  }

  // Replace theme values throughout the class
  className = replaceThemeValue(className, { assert, theme })

  // Add missing parent selectors and collapse arbitrary variants
  className = sassifyArbitraryVariants(className, { tailwindConfig })

  debug('class after format', className)

  return className
}

function isArbitraryVariant(variant: string): boolean {
  return variant.startsWith('[') && variant.endsWith(']')
}

function unbracket(variant: string): string {
  return variant.slice(1, -1)
}

function sassifyArbitraryVariants(
  fullClassName: string,
  { tailwindConfig }: { tailwindConfig: TailwindConfig }
): string {
  const splitArray = [
    ...splitAtTopLevelOnly(fullClassName, tailwindConfig.separator ?? ':'),
  ]

  const variants = splitArray.slice(0, -1)
  const className = splitArray.slice(-1)[0]

  if (variants.length === 0) return fullClassName

  // Collapse arbitrary variants when they don't contain `&`.
  // `[> div]:[.nav]:(flex block)` -> `[> div_.nav]:flex [> div_.nav]:block`
  const collapsed = [] as string[]
  variants.forEach((variant, index) => {
    // We can’t match the selector if there's a character right next to the parent selector (eg: `[&section]:block`) otherwise we'd accidentally replace `.step` in classes like this:
    // Bad: `.steps-primary .steps` -> `&-primary &`
    // Good: `.steps-primary .steps` -> `.steps-primary &`
    // So here we replace it with crazy brackets to identify and unwrap it later
    if (isArbitraryVariant(variant))
      variant = variant.replace(ALL_WRAPPABLE_PARENT_SELECTORS, '(((&)))')

    if (
      index === 0 ||
      !isArbitraryVariant(variant) ||
      !isArbitraryVariant(variants[index - 1])
    )
      return collapsed.push(variant)

    const prev = collapsed[collapsed.length - 1]

    if (variant.includes('&')) {
      const prevHasParent = prev.includes('&')

      // Merge with current
      if (prevHasParent) {
        const mergedWithCurrent = variant.replace(
          ALL_AMPERSANDS,
          unbracket(prev)
        )
        const isLast = index === variants.length - 1
        collapsed[index - 1] = isLast
          ? mergedWithCurrent.replace(ALL_AMPERSANDS, '')
          : mergedWithCurrent
        return
      }

      // Merge with previous
      if (!prevHasParent) {
        const mergedWithPrev = `[${unbracket(variant).replace(
          ALL_AMPERSANDS,
          unbracket(prev)
        )}]`
        collapsed[collapsed.length - 1] = mergedWithPrev
        return
      }
    }

    // Parentless variants are merged into the previous arbitrary variant
    const mergedWithPrev = `[${[
      unbracket(prev).replace(ENDING_AMP_THEN_WHITESPACE, ''),
      unbracket(variant),
    ].join('_')}]`
    collapsed[collapsed.length - 1] = mergedWithPrev
  })

  // The supplied class requires the reversal of it's variants as resolveMatches adds them in reverse order
  const reversedVariantList = [...collapsed].slice().reverse()
  const allVariants = reversedVariantList.map((v, idx) => {
    if (!isArbitraryVariant(v)) return v

    const unwrappedVariant = unbracket(v)
      // Unescaped dots incorrectly add the prefix within arbitrary variants (only when`prefix` is set in tailwind config)
      // eg: tw`[.a]:first:tw-block` -> `.tw-a &:first-child`
      .replace(ALL_CLASS_DOTS, '\\.')
      // Unescaped ats will throw a conversion error
      .replace(ALL_CLASS_ATS, '\\@')

    const variantList = unwrappedVariant.startsWith('@')
      ? [unwrappedVariant]
      : // Arbitrary variants with commas are split, handled as separate selectors then joined
        [...splitAtTopLevelOnly(unwrappedVariant, ',')]
    const out = variantList
      .map(variant =>
        addParentSelector(variant, collapsed[idx - 1], collapsed[idx + 1] ?? '')
      )
      // Tailwindcss removes everything from a comma onwards in arbitrary variants, so we need to encode to preserve them
      // Underscore is needed to distance the code from another possible number
      // Eg: [path[fill='rgb(51,100,51)']]:[fill:white]
      .join('\\2c_')
      .replace(ALL_COMMAS, '\\2c_')

    return `[${out}]`
  })

  return [...allVariants, className].join(tailwindConfig.separator ?? ':')
}

function addParentSelector(
  selector: string,
  prev: string,
  next: string
): string {
  // Preserve selectors with a parent selector and media queries
  if (selector.includes('&') || selector.startsWith('@')) return selector

  // Arbitrary variants
  // Pseudo elements get an auto parent selector prefixed
  if (selector.startsWith(':')) return `&${selector}`
  // Variants that start with a class/id get treated as a child
  if (BASIC_SELECTOR_TYPES.test(selector) && !prev) return `& ${selector}`
  // When there's more than one variant and it's at the end then prefix it
  if (!next && prev) return `&${selector}`

  return `& ${selector}`
}

export default convertClassName
