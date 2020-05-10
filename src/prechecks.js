import { assert } from './utils'
import { logBadGood } from './logging'

const precheckGroup = ({ classNameRaw }) =>
  assert(
    classNameRaw === 'group',
    () =>
      `"group" must be added as className:\n\n${logBadGood(
        'tw`group`',
        '<div className="group">'
      )}\n`
  )

const doPrechecks = (prechecks, context) => {
  for (const precheck of prechecks) {
    precheck(context)
  }
}

export { doPrechecks as default, precheckGroup }
