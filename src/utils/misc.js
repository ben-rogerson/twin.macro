import dlv from 'dlv'
import { MacroError } from 'babel-plugin-macros'

const assert = (expression, callBack) => {
  if (!expression) return
  throw new MacroError(callBack())
}

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)

const addPxTo0 = string => (Number(string) === 0 ? `${string}px` : string)

const getTheme = configTheme => (grab, sub, theme = configTheme) =>
  grab ? dlv(theme, sub ? [grab, sub] : grab) : theme

const stripNegative = string =>
  string && string.length > 1 && string.slice(0, 1) === '-'
    ? string.slice(1, string.length)
    : string

export { assert, isEmpty, addPxTo0, getTheme, stripNegative }
