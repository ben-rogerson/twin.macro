import {
  replaceWithLocation,
  astify,
  getFunctionValue,
  getTaggedTemplateValue,
} from './lib/astHelpers'

const handleThemeFunction = ({ references, t, state, coreContext }) => {
  if (!references.theme) return

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  references.theme.forEach(path => {
    const { input, parent } = getTaggedTemplateValue(path) ||
      getFunctionValue(path) || { input: null, parent: null }

    state.assert(
      parent,
      () =>
        "The theme value doesn’t look right\n\nTry using it like this: theme`colors.black` or theme('colors.black')"
    )

    const themeValue = coreContext.theme(input)

    state.assert(Boolean(themeValue), c =>
      c.error(`✕ ${c.errorLight(input)} was not found in the tailwind config`)
    )

    return replaceWithLocation(parent, astify(themeValue, t))
  })
}

export { handleThemeFunction }
