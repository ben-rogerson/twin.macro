import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'
import { splitAtTopLevelOnly } from './util/twImports'
import type { CoreContext, TailwindConfig } from 'core/types'
// eslint-disable-next-line import/no-relative-parent-imports
import { SPACE_ID, SPACES } from '../constants'

const ALL_COMMAS = /,/g
const ALL_AMPERSANDS = /&/g
const ENDING_AMP_THEN_WHITESPACE = /&[\s_]*$/
const ALL_CLASS_DOTS = /(?<!\\)(\.)(?=\w)/g

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

  // Add a parent selector if it's missing from an arbitrary variant
  className = addMissingParentSelector(className, { tailwindConfig })

  debug('class after format', className)

  return className
}

function isArbitraryVariant(variant: string): boolean {
  return variant.startsWith('[') && variant.endsWith(']')
}

function unbracket(variant: string): string {
  return variant.slice(1, -1)
}

function addMissingParentSelector(
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
  variants
    // Deal with tailwindcss inability to maintain order of variants.
    // Unfortunately this means we have to group arbitrary variants and lose the
    // original ordering if there are non-arbitrary variants in the mix.
    .reverse()
    .sort((a, b) => {
      if (isArbitraryVariant(a)) return 1
      if (isArbitraryVariant(b)) return -1
      return 0
    })
    .reverse()
    .forEach((variant, index) => {
      // This code attempts to replicate sass-type usage of the parent selector
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
  const variantsWithParentSelectors = collapsed.map(v => {
    if (!isArbitraryVariant(v)) return v
    const out = addParentSelector(unbracket(v))
    return `[${out}]`
  })

  return [...variantsWithParentSelectors, className].join(
    tailwindConfig.separator ?? ':'
  )
}

function addParentSelector(rawSelector: string): string {
  // Tailwindcss requires pre-encoded commas - unencoded are removed and we end up with an invalid selector
  let selector = rawSelector.replace(ALL_COMMAS, '\\2c')
  // Escape class dots in the selector - otherwise tailwindcss adds a the prefix within arbitrary variants (only when `prefix` is set in tailwind config)
  // eg: tw`[.a]:first:tw-block` -> `.tw-a &:first-child`
  selector = selector.replace(ALL_CLASS_DOTS, '\\.')
  // Preserve selectors with a parent selector and media queries
  if (selector.includes('&') || selector.startsWith('@')) return selector
  // Pseudo elements get an auto parent selector prefixed
  if (selector.startsWith(':')) return `&${selector}`

  return `&_${selector}`
}

export default convertClassName
