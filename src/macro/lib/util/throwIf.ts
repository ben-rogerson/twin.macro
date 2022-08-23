import { MacroError } from 'babel-plugin-macros'

export default function throwIf(
  expression: unknown,
  callBack: () => string
): void {
  if (!expression) return
  throw new MacroError(callBack())
}
