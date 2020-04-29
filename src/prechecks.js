import { assert } from './utils'
import { logNoTrailingDash, logBadGood } from './logging'

const precheckGroup = ({ classNameRaw }) =>
  assert(
    classNameRaw === 'group',
    `"group" must be added as className:\n\n${logBadGood(
      'tw`group`',
      '<div className="group">'
    )}\n`
  )

const precheckTrailingSlash = ({ classNameRaw }) =>
  assert(classNameRaw.endsWith('-'), logNoTrailingDash(classNameRaw))

const doPrechecks = (prechecks, context) => {
  for (const precheck of prechecks) {
    precheck(context)
  }
}

export { doPrechecks as default, precheckGroup, precheckTrailingSlash }
