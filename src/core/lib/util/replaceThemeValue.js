const MATCH_THEME = /theme\((.+?)\)/
const MATCH_QUOTES = /["'`]/g

const replaceThemeValue = (value, { assert, theme }) => {
  const match = value.match(MATCH_THEME)
  if (!match) return value

  const themeFunction = match[0]
  const themeParameters = match[1].replace(MATCH_QUOTES, '').trim()

  const themeValue = theme(...themeParameters.split(','))

  assert(Boolean(themeValue), colors =>
    colors.error(
      `✕ ${colors.errorLight(
        themeParameters
      )} doesn’t match a theme value from the config`
    )
  )

  const replacedValue = value.replace(themeFunction, themeValue)
  return replacedValue
}

export default replaceThemeValue
