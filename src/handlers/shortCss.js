import { throwIf, camelize, splitOnFirst, replaceSpaceId } from '../utils'
import { logBadGood } from '../logging'
import { replaceThemeValue } from './helpers'

const splitShortCss = className => {
  const [property, value] = splitOnFirst(className, '[')
  return [property, value.slice(0, -1).trim()]
}

/**
 * @deprecated
 * Due to similarities, short css was replaced by arbitrary properties
 * https://twinredirect.page.link/short-css
 */
const handleShortCss = args => {
  const { isCsOnly, className, theme, state } = args

  let [property, value] = splitShortCss(className)

  // Error if short css is used and disabled
  const isShortCssDisabled = state.configTwin.disableShortCss && !isCsOnly
  throwIf(isShortCssDisabled, () =>
    logBadGood(
      replaceSpaceId(args.pieces.classNameRawNoVariants),
      `[${[property, value].join(
        ':'
      )}]\n\nShort css has been deprecated and replaced by arbitrary properties\nRead more at https://twinredirect.page.link/short-css\n\nEnable short css again with this twin config: { "disableShortCss": false }`
    )
  )

  // Camelize properties that aren't css variables
  property = (property.startsWith('--') && property) || camelize(property)

  throwIf(!property, () =>
    logBadGood(
      `“[${value}]” is missing the css property before the square brackets`,
      `Write it like this: marginTop[${value || '5rem'}]`
    )
  )

  const themeReplacedValue = replaceThemeValue(value, { theme })

  return { [property]: themeReplacedValue }
}

export default handleShortCss
