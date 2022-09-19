import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'
import type { CoreContext } from 'core/types'
// eslint-disable-next-line import/no-relative-parent-imports
import { SPACE_ID, SPACE_ID_TEMP_ALL } from '../constants'

const SPLIT_COLON_AVOID_WITHIN_SQUARE_BRACKETS =
  /:(?=(?:(?:(?!]).)*\[)|[^[\]]*$)/g
const ARBITRARY_VARIANTS = /(?<=\[)(.+?)(?=]:)/g
const ALL_COMMAS = /,/g

type ConvertShortCssToArbitraryPropertyParameters = {
  disableShortCss: CoreContext['twinConfig']['disableShortCss']
} & Pick<CoreContext, 'assert' | 'isShortCssOnly'>

function convertShortCssToArbitraryProperty(
  className: string,
  {
    assert,
    disableShortCss,
    isShortCssOnly,
  }: ConvertShortCssToArbitraryPropertyParameters
): string {
  const splitArray = className.split(SPLIT_COLON_AVOID_WITHIN_SQUARE_BRACKETS)

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
  ].join(':')}]`
  splitArray.splice(-1, 1, template)

  const arbitraryProperty = splitArray.join(':')

  const isShortCssDisabled = disableShortCss && !isShortCssOnly
  assert(!isShortCssDisabled, ({ color }) =>
    [
      `${String(
        color(
          `✕ ${String(
            color(className, 'errorLight')
          )} uses the deprecated short css syntax`
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
} & Pick<CoreContext, 'theme' | 'assert' | 'debug' | 'isShortCssOnly'>

function convertClassName(
  className: string,
  {
    theme,
    isShortCssOnly,
    disableShortCss,
    assert,
    debug,
  }: ConvertClassNameParameters
): string {
  // Remove twins temporary space ids (added so variant groups can be expanded)
  className = className.replace(SPACE_ID_TEMP_ALL, SPACE_ID)

  // Move the bang to the front of the class
  if (className.endsWith('!')) {
    debug('trailing bang found', className)

    const splitArray = className
      .slice(0, -1)
      .split(SPLIT_COLON_AVOID_WITHIN_SQUARE_BRACKETS)
    // Place a ! before the class
    splitArray.splice(-1, 1, `!${splitArray[splitArray.length - 1]}`)
    className = splitArray.join(':')
  }

  // Convert short css to an arbitrary property, eg: `[display:block]`
  // (Short css is deprecated)
  if (isShortCss(className)) {
    debug('short css found', className)
    className = convertShortCssToArbitraryProperty(className, {
      assert,
      disableShortCss,
      isShortCssOnly,
    })
  }

  // Replace theme values throughout the class
  className = replaceThemeValue(className, { assert, theme })

  // Add a parent selector if it's missing from the arbitrary variant
  const arbitraryVariantsCount = className.match(ARBITRARY_VARIANTS)
  className = className.replace(ARBITRARY_VARIANTS, (v, _, offset) =>
    addParentSelector(v, offset, arbitraryVariantsCount)
  )

  debug('class after format', className)

  return className
}

function escapeCommas(className: string): string {
  return className.replace(ALL_COMMAS, '\\2c')
}

function addParentSelector(
  value: string,
  offset: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  arbitraryVariantsCount: string[] | null
): string {
  // Tailwindcss requires pre-encoded commas - unencoded are removed and we end up with an invalid selector
  const selector = escapeCommas(value)
  // Preserve selectors with parent selector or media queries
  if (selector.includes('&') || selector.startsWith('@')) return selector
  // pseudo
  if (selector.startsWith(':')) return `&${selector}`
  // Selectors with multiple arbitrary variants are too hard to determine so follow a basic rule instead
  if (arbitraryVariantsCount && arbitraryVariantsCount.length > 1)
    return `&_${selector}`
  // If the arbitrary variant is the first selector, add a parent selector
  return offset === 1 ? `&_${selector}` : `${selector}_&`
}

export default convertClassName
