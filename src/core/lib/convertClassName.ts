import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'
import { splitAtTopLevelOnly } from './util/twImports'
import type { CoreContext, TailwindConfig } from 'core/types'
// eslint-disable-next-line import/no-relative-parent-imports
import { SPACE_ID, SPACES } from '../constants'

const ALL_COMMAS = /,/g

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
  className = checkForMissingParentSelector(className, { tailwindConfig })

  debug('class after format', className)

  return className
}

function escapeCommas(className: string): string {
  return className.replace(ALL_COMMAS, '\\2c')
}

function checkForMissingParentSelector(
  fullClassName: string,
  { tailwindConfig }: { tailwindConfig: TailwindConfig }
): string {
  const splitArray = [
    ...splitAtTopLevelOnly(fullClassName, tailwindConfig.separator ?? ':'),
  ]

  const variants = splitArray.slice(0, -1)
  const className = splitArray.slice(-1)[0]

  const arbitraryVariantsCount = variants.filter(
    v => v.startsWith('[') && v.endsWith(']')
  ).length
  if (arbitraryVariantsCount === 0) return fullClassName

  const variantsNew = variants.map((v, offset) => {
    if (!(v.startsWith('[') && v.endsWith(']'))) return v

    // Missing parent selector found
    const unwrapped = v.slice(1, -1)
    const added = addParentSelector(unwrapped, offset, arbitraryVariantsCount)
    return `[${added}]`
  })

  return [...variantsNew, className].join(tailwindConfig.separator ?? ':')
}

function addParentSelector(
  value: string,
  offset: number,
  arbitraryVariantsCount: number
): string {
  // Tailwindcss requires pre-encoded commas - unencoded are removed and we end up with an invalid selector
  const selector = escapeCommas(value)
  // Preserve selectors with parent selector or media queries
  if (selector.includes('&') || selector.startsWith('@')) return selector
  // pseudo
  if (selector.startsWith(':')) return `&${selector}`
  // Selectors with multiple arbitrary variants are too hard to determine so follow a basic rule instead
  if (arbitraryVariantsCount > 1) return `&_${selector}`
  // If the arbitrary variant is the first selector, add a parent selector
  return offset === 0 ? `&_${selector}` : `${selector}_&`
}

export default convertClassName
