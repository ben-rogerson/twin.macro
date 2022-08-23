import {
  replaceWithLocation,
  astify,
  getFunctionValue,
  getTaggedTemplateValue,
} from './lib/astHelpers'
import { logGeneralError } from './lib/logging'
import throwIf from './lib/util/throwIf'
import type { AdditionalHandlerParameters, NodePath } from './types'

function handleThemeFunction({
  references,
  t,
  coreContext,
}: AdditionalHandlerParameters): void {
  if (!references.theme) return

  references.theme.forEach((path): never[] | [Node | NodePath] => {
    const ttValue = getTaggedTemplateValue(path) ??
      getFunctionValue(path) ?? { input: null, parent: null }

    const { input, parent } = ttValue as {
      parent: NodePath
      input: string
    }

    throwIf(
      !parent,
      () =>
        "The theme value doesn’t look right\n\nTry using it like this: theme`colors.black` or theme('colors.black')"
    )

    const themeValue = coreContext.theme(input)

    throwIf(!themeValue, () =>
      logGeneralError(`${input} was not found in the tailwind config`)
    )

    return replaceWithLocation(parent, astify(themeValue, t))
  })
}

export { handleThemeFunction }
