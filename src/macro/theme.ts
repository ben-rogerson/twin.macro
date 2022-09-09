import {
  replaceWithLocation,
  astify,
  getFunctionValue,
  getTaggedTemplateValue,
} from './lib/astHelpers'
import type { AssertContext } from 'core/types'
import type { AdditionalHandlerParameters, NodePath } from 'macro/types'

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
      input?: string
    }

    if (input !== '')
      coreContext.assert(
        Boolean(input),
        ({ color }: AssertContext) =>
          `${color(`✕ The theme value doesn’t look right`)}\n\nTry ${color(
            'theme`colors.black`',
            'success'
          )} or ${color(`theme('colors.black')`, 'success')}`
      )

    coreContext.assert(
      Boolean(parent),
      ({ color }: AssertContext) =>
        `${color(
          `✕ The theme value ${color(
            input as string,
            'errorLight'
          )} doesn’t look right`
        )}\n\nTry ${color('theme`colors.black`', 'success')} or ${color(
          `theme('colors.black')`,
          'success'
        )}`
    )

    const themeValue = coreContext.theme(input as string)

    coreContext.assert(Boolean(themeValue), ({ color }: AssertContext) =>
      color(
        `✕ ${color(
          input as string,
          'errorLight'
        )} doesn’t match a theme value from the config`
      )
    )

    return replaceWithLocation(parent, astify(themeValue, t))
  })
}

export { handleThemeFunction }
