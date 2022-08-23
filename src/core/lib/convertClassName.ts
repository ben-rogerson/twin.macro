import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'
// eslint-disable-next-line import/no-relative-parent-imports
import type { CoreContext } from '../types'

const SPLIT_COLON_AVOID_WITHIN_SQUARE_BRACKETS =
  /:(?=(?:(?:(?!]).)*\[)|[^[\]]*$)/g
const ARBITRARY_VARIANTS = /(?!\[)([^[\]]+)(?=]:)/g

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

  const template = `${preSelector}[${[property, value]
    .filter(Boolean)
    .join(':')}]`
  splitArray.splice(-1, 1, template)

  const arbitraryProperty = splitArray.join(':')

  const isShortCssDisabled = disableShortCss && !isShortCssOnly
  assert(!isShortCssDisabled, ({ color }) =>
    [
      `${String(
        color.error(
          `✕ ${String(
            color.errorLight(className)
          )} uses the deprecated short css syntax`
        )
      )}`,
      `Update to ${String(color.success(arbitraryProperty))}`,
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
  className = className.replace(ARBITRARY_VARIANTS, (v, _, offset) => {
    if (v.includes('&')) return v
    if (arbitraryVariantsCount && arbitraryVariantsCount.length > 1)
      return `${v}_&`
    return offset === 1 ? `&_${v}` : `${v}_&`
  })

  debug('class after format', className)

  return className
}

export default convertClassName
