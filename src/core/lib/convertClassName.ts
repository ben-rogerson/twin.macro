import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'
import { splitAtTopLevelOnly } from './util/twImports'
import type { CoreContext, TailwindConfig } from 'core/types'
// eslint-disable-next-line import/no-relative-parent-imports
import { SPACE_ID, SPACES } from '../constants'

const ALL_COMMAS = /,/g
const ALL_CLASS_DOTS = /(?<!\\)(\.)(?=\w)/g
const MEDIA_VARIANTS = new Set([
  'dark',
  'light',
  'ltr',
  'rtl',
  'motion-safe',
  'motion-reduce',
  'print',
  'screen',
  'portrait',
  'landscape',
  'contrast-more',
  'contrast-less',
  'any-pointer-none',
  'any-pointer-fine',
  'any-pointer-coarse',
  'pointer-none',
  'pointer-fine',
  'pointer-coarse',
  'any-hover-none',
  'any-hover',
  'can-hover',
  'cant-hover',
])

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
    .sort((a, b) => {
      // Move arbitrary variants without parent selectors to the end
      if (isArbitraryVariant(a)) return 1
      if (isArbitraryVariant(b)) return -1
      return 0
    })
    .forEach((variant, index) => {
      if (
        index === 0 ||
        !isArbitraryVariant(variant) ||
        !isArbitraryVariant(variants[index - 1])
      )
        return collapsed.push(variant)

      if (variant.includes('&') && variants[index - 1].includes('&'))
        return collapsed.push(variant)

      collapsed[collapsed.length - 1] = [
        collapsed[collapsed.length - 1].slice(0, -1),
        variant.slice(1),
      ].join('_')
    })

  // Remove non-styling variants (sm, md, etc) from the variants list
  const screenConfig = tailwindConfig.theme?.screens ?? {}
  const screens = Object.keys(screenConfig)
  const nonStylingVariantsRemoved = collapsed.filter(
    c => !screens.includes(c) && !MEDIA_VARIANTS.has(c)
  )

  // Use that list to either prefix or suffix with the parent selector
  const variantsWithParentSelectors = collapsed.map(v => {
    if (!isArbitraryVariant(v)) return v
    const out = addParentSelector(
      v.slice(1, -1),
      nonStylingVariantsRemoved.indexOf(v) !== 0
    )
    return `[${out}]`
  })

  return [...variantsWithParentSelectors, className].join(
    tailwindConfig.separator ?? ':'
  )
}

function addParentSelector(rawSelector: string, shouldSuffix: boolean): string {
  // Tailwindcss requires pre-encoded commas - unencoded are removed and we end up with an invalid selector
  let selector = rawSelector.replace(ALL_COMMAS, '\\2c')
  // Escape class dots in the selector - otherwise tailwindcss adds a the prefix within arbitrary variants (only when `prefix` is set in tailwind config)
  // eg: tw`[.a]:first:tw-block` -> `.tw-a &:first-child`
  selector = selector.replace(ALL_CLASS_DOTS, '\\.')
  // Preserve selectors with a parent selector and media queries
  if (selector.includes('&') || selector.startsWith('@')) return selector
  // Pseudo elements get an auto parent selector prefixed
  if (selector.startsWith(':')) return `&${selector}`

  return shouldSuffix ? `${selector}_&` : `&_${selector}`
}

export default convertClassName
