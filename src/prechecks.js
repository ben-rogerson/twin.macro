import { throwIf } from './utils'
import { logBadGood } from './logging'

const precheckGroup = ({ classNameRaw }) =>
  throwIf(
    classNameRaw === 'group',
    () =>
      `\n\n"group" must be added as className:${logBadGood(
        'tw`group`',
        '<div className="group">'
      )}`
  )

const doPrechecks = (prechecks, context) => {
  for (const precheck of prechecks) {
    precheck(context)
  }
}

export { doPrechecks as default, precheckGroup }
