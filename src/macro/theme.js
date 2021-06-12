import {
  replaceWithLocation,
  astify,
  getFunctionValue,
  getTaggedTemplateValue,
} from './../macroHelpers'
import { getTheme, throwIf, get } from './../utils'
import { logGeneralError, themeErrorNotFound } from './../logging'

const trimInput = themeValue => {
  const arrayValues = themeValue
    // Split at dots outside of square brackets
    .split(/\.(?=(((?!]).)*\[)|[^[\]]*$)/)
    .filter(Boolean)
  if (arrayValues.length === 1) {
    return arrayValues[0]
  }

  return arrayValues.slice(0, -1).join('.')
}

const handleThemeFunction = ({ references, t, state }) => {
  if (!references.theme) return

  const theme = getTheme(state.config.theme)

  references.theme.forEach(path => {
    const { input, parent } =
      getTaggedTemplateValue(path) || getFunctionValue(path) || ''

    throwIf(!parent, () =>
      logGeneralError(
        "The theme value doesn’t look right\n\nTry using it like this: theme`colors.black` or theme('colors.black')"
      )
    )

    const themeValue = theme(input)
    throwIf(!themeValue, () =>
      themeErrorNotFound({
        theme: input.includes('.') ? get(theme(), trimInput(input)) : theme(),
        input,
        trimInput: trimInput(input),
      })
    )

    return replaceWithLocation(parent, astify(themeValue, t))
  })
}

export { handleThemeFunction }
