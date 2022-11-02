import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'
import { splitAtTopLevelOnly } from './util/twImports'
import type {
  Assert,
  AssertContext,
  CoreContext,
  TailwindConfig,
} from 'core/types'
// eslint-disable-next-line import/no-relative-parent-imports
import { SPACE_ID, SPACES } from '../constants'

const ALL_COMMAS = /,/g
const ALL_AMPERSANDS = /&/g
const ENDING_AMP_THEN_WHITESPACE = /&[\s_]*$/
const ALL_CLASS_DOTS = /(?<!\\)(\.)(?=\w)/g
const ALL_WRAPPABLE_PARENT_SELECTORS = /&(?=([^ $)*+,.:>[_~])[\w-])/g
const BASIC_SELECTOR_TYPES = /^#|^\\./

type ConvertShortCssToArbitraryPropertyParameters = {
  disableShortCss: CoreContext['twinConfig']['disableShortCss']
} & Pick<CoreContext, 'tailwindConfig' | 'assert' | 'isShortCssOnly'>

function convertShortCssToArbitraryProperty(
  className: string,
  {
    tailwindConfig,
    assert,
    disableShortCss,
    isShortCssOnly,
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
            color(className, 'errorLight')
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
    })
  }

  // Replace theme values throughout the class
  className = replaceThemeValue(className, { assert, theme })

  // Add missing parent selectors and collapse arbitrary variants
  className = sassifyArbitraryVariants(className, { assert, tailwindConfig })

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
  { assert, tailwindConfig }: { assert: Assert; tailwindConfig: TailwindConfig }
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

  // Use that list to add the parent selector
  let hasArbitraryVariant = false
  let hasNormalVariant = false
  const variantsWithParentSelectors = collapsed.map((v, idx) => {
    if (!isArbitraryVariant(v)) {
      if (idx > 0 && hasArbitraryVariant) hasNormalVariant = true
      return v
    }

    // The ordering gets screwy in the selector when using a mix of arbitrary variants, normal variants and the auto parent feature - so notify in that case
    const isMissingParentSelectorOkay =
      hasArbitraryVariant && hasNormalVariant && !v.includes('&')
    assert(
      !isMissingParentSelectorOkay,
      ({ color }: AssertContext) =>
        `${color(
          `✕ ${String(
            color(fullClassName, 'errorLight')
          )} had trouble with the auto parent selector feature`
        )}\n\nYou’ll need to add the parent selector manually within the arbitrary variant(s), eg: ${String(
          color(`[section &]:block`, 'success')
        )}`
    )

    hasArbitraryVariant = true

    const out = addParentSelector(
      unbracket(v),
      collapsed[idx - 1],
      collapsed[idx + 1] ?? ''
    )
    return `[${out}]`
  })

  return [...variantsWithParentSelectors, className].join(
    tailwindConfig.separator ?? ':'
  )
}

function addParentSelector(
  rawSelector: string,
  prev: string,
  next: string
): string {
  // Tailwindcss requires pre-encoded commas - unencoded are removed and we end up with an invalid selector
  let selector = rawSelector.replace(ALL_COMMAS, '\\2c')
  // Escape class dots in the selector - otherwise tailwindcss adds a the prefix within arbitrary variants (only when `prefix` is set in tailwind config)
  // eg: tw`[.a]:first:tw-block` -> `.tw-a &:first-child`
  selector = selector.replace(ALL_CLASS_DOTS, '\\.')
  // Preserve selectors with a parent selector and media queries
  if (selector.includes('&') || selector.startsWith('@')) return selector

  // Arbitrary variants
  // Variants that start with a class/id get treated as a child
  if (BASIC_SELECTOR_TYPES.test(selector) && !prev) return `& ${selector}`
  // Pseudo elements get an auto parent selector prefixed
  if (selector.startsWith(':')) return `&${selector}`
  // When there's more than one variant and it's at the end then prefix it
  if (!next && prev) return `&${selector}`
  // When a non arbitrary variant follows then we combine it with the current
  // selector by adding the parent selector at the end
  // eg: `[input&]:focus:...` -> `input:focus:...`
  if (next && !isArbitraryVariant(next)) return `${selector}&`

  return `&_${selector}`
}

export default convertClassName
