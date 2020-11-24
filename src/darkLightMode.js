import { throwIf } from './utils'
import { logBadGood } from './logging'

const checkDarkLightClasses = className =>
  throwIf(
    ['dark', 'light'].includes(className),
    () =>
      `\n\n"${className}" must be added as className:\n\n${logBadGood(
        `tw\`${className}\``,
        `<div className="${className}">`
      )}\n\nRead more at https://twinredirect.page.link/darkLightMode\n`
  )

export { checkDarkLightClasses }
