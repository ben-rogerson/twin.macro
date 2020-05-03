import dlv from 'dlv'
import { MacroError } from 'babel-plugin-macros'

const assert = (expression, error) => {
  if (!expression) return
  throw new MacroError(error)
}

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)

const addPxTo0 = string => (Number(string) === 0 ? `${string}px` : string)

const getTheme = configTheme => (grab, sub, theme = configTheme) =>
  grab ? dlv(theme, sub ? [grab, sub] : grab) : theme

export { assert, isEmpty, addPxTo0, getTheme }
