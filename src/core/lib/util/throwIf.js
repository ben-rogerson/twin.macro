import { MacroError } from 'babel-plugin-macros'

export default (expression, callBack) => {
  if (!expression) return
  throw new MacroError(callBack())
}
