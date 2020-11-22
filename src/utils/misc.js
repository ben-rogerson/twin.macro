import dlv from 'dlv'
import { MacroError } from 'babel-plugin-macros'

const throwIf = (expression, callBack) => {
  if (!expression) return
  throw new MacroError(callBack())
}

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)

const addPxTo0 = string => (Number(string) === 0 ? `${string}px` : string)

function transformThemeValue(themeSection) {
  if (['fontSize', 'outline'].includes(themeSection)) {
    return value => (Array.isArray(value) ? value[0] : value)
  }

  if (
    [
      'fontFamily',
      'boxShadow',
      'transitionProperty',
      'transitionDuration',
      'transitionDelay',
      'transitionTimingFunction',
      'backgroundImage',
      'backgroundSize',
      'backgroundColor',
      'cursor',
      'animation',
    ].includes(themeSection)
  ) {
    return value => (Array.isArray(value) ? value.join(', ') : value)
  }

  return value => value
}

const getTheme = configTheme => (grab, sub, theme = configTheme) => {
  if (!grab) return theme

  const themeGrab = sub ? [grab, sub] : grab

  const themeSection = themeGrab.split('.')[0]
  const value = dlv(theme, themeGrab)

  const result = transformThemeValue(themeSection)(value)
  return result
}

const stripNegative = string =>
  string && string.length > 1 && string.slice(0, 1) === '-'
    ? string.slice(1, string.length)
    : string

export { throwIf, isEmpty, addPxTo0, getTheme, stripNegative }
