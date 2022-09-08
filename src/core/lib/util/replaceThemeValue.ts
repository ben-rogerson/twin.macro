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
  const themeValue = theme(main, second)

  assert(Boolean(themeValue), ({ color }: AssertContext) =>
    color(
      `✕ ${color(
        themeParameters,
        'errorLight'
      )} doesn’t match a theme value from the config`
    )
  )

  const replacedValue = value.replace(themeFunction, String(themeValue))
  return replacedValue
}

export default replaceThemeValue
