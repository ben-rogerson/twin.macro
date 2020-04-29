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

export { assert, isEmpty, addPxTo0 }
export { stringifyScreen } from './../screens' // For backwards compat

export { default as resolveConfig } from './resolveConfig'
export { default as getPieces } from './getPieces'
export { default as getProperties } from './getProperties'
export { default as withAlpha } from './withAlpha'
