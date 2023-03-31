import type { AssertContext, CoreContext } from 'core/types'

const MATCH_THEME = /theme\((.+?)\)/
const MATCH_QUOTES = /["'`]/g

function replaceThemeValue(
  value: string,
  {
    assert,
    theme,
  }: { assert: CoreContext['assert']; theme: CoreContext['theme'] }
): string {
  const match = MATCH_THEME.exec(value)
  if (!match) return value

  const themeFunction = match[0]
  const themeParameters = match[1].replace(MATCH_QUOTES, '').trim()

  const [main, second] = themeParameters.split(',')
  let themeValue = theme(main, second)

  assert(Boolean(themeValue), ({ color }: AssertContext) =>
    color(
      `✕ ${color(
        themeParameters,
        'errorLight'
      )} doesn’t match a theme value from the config`
    )
  )

  // Account for the 'DEFAULT' key
  if (typeof themeValue === 'object' && 'DEFAULT' in themeValue) {
    themeValue = themeValue.DEFAULT as typeof themeValue
  }

  // Escape spaces in the value - without this we get an incorrect order
  // in class groups like this:
  // tw`w-[calc(100%-theme('spacing.1'))] w-[calc(100%-theme('spacing[0.5]'))]`
  // theme: { spacing: { 0.5: "calc(.5 * .25rem)", 1: "calc(1 * .25rem)" } }
  const stringValue = String(themeValue).replace(/\./g, '\\.')

  const replacedValue = value.replace(themeFunction, stringValue)

  return replacedValue
}

export default replaceThemeValue
