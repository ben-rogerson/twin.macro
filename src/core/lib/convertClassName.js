import { logBadGood } from './logging'
import replaceThemeValue from './util/replaceThemeValue'
import isShortCss from './util/isShortCss'
import splitOnFirst from './util/splitOnFirst'

const SPLIT_COLON_AVOID_WITHIN_SQUARE_BRACKETS =
  /:(?=(?:(?:(?!]).)*\[)|[^[\]]*$)/g
const ARBITRARY_VARIANTS = /(?!\[)([^[\]]+)(?=]:)/g

const convertShortCssToArbitraryProperty = (
  className,
  { assert, disableShortCss, isCsOnly }
) => {
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

  const isShortCssDisabled = disableShortCss && !isCsOnly
  assert(
    !isShortCssDisabled,
    `\`${className}\` uses the deprecated short css syntax${logBadGood(
      className,
      arbitraryProperty,
      `Enable short css again with this twin config: { "disableShortCss": false }\nRead more at https://twinredirect.page.link/short-css`
    )}`
  )

  return arbitraryProperty
}

const convertClassName = (
  className,
  { theme, isCsOnly, disableShortCss, assert, debug }
) => {
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
      isCsOnly,
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
