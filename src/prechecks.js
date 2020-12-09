import { throwIf } from './utils'
import { logBadGood } from './logging'

const precheckGroup = ({ classNameRaw }) =>
  throwIf(
    classNameRaw === 'group',
    () =>
      `\n\n"group" must be added as className:\n\n${logBadGood(
        'tw`group`',
        '<div className="group">'
      )}\n\nRead more at https://twinredirect.page.link/group\n`
  )

const doPrechecks = (prechecks, context) => {
  for (const precheck of prechecks) {
    precheck(context)
  }
}

export { doPrechecks as default, precheckGroup }
