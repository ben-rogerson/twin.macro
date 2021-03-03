import { throwIf } from './utils'
import { logBadGood } from './logging'
import { isCssClass } from './getProperties'

const precheckGroup = ({ classNameRaw }) =>
  throwIf(
    classNameRaw === 'group',
    () =>
      `\n\n"group" must be added as className:${logBadGood(
        'tw`group`',
        '<div className="group">'
      )}\nRead more at https://twinredirect.page.link/group\n`
  )

const joinWithNoDoubleHyphens = arr => arr.join('-').replace(/-+/g, '-')

const preCheckPrefix = ({ pieces: { className, hasPrefix }, state }) => {
  if (isCssClass(className)) return

  const { prefix } = state.config
  if (hasPrefix === Boolean(prefix)) return

  const classSuggestion = joinWithNoDoubleHyphens([prefix, className])

  throwIf(
    !className.startsWith(prefix),
    () =>
      `\n\n“${className}” should have a prefix:${logBadGood(
        className,
        classSuggestion
      )}`
  )
}

const doPrechecks = (prechecks, context) => {
  for (const precheck of prechecks) {
    precheck(context)
  }
}

export { doPrechecks as default, precheckGroup, preCheckPrefix }
