import deepMerge from './lib/util/deepMerge'
import extractRuleStyles from './extractRuleStyles'
import { LAYER_DEFAULTS } from './constants'
import type { CoreContext, CssObject, Candidate } from './types'

function getGlobalStyles(params: CoreContext): CssObject | undefined {
  const candidates = [...params.tailwindContext.candidateRuleMap]

  const globalPluginStyles = candidates
    .flatMap(([, candidate]: [unknown, Candidate[]]) => {
      const out = candidate.map(([data, rule]) => {
        if (data.layer !== LAYER_DEFAULTS) return
        return extractRuleStyles([rule], { ...params, passChecks: true })
      })
      if (out.length === 0) return

      return out
    })
    .filter(Boolean)

  const [globalKey, preflightRules]: [string, Candidate[]] = candidates[0]
  // @ts-expect-error TOFIX: Fix tuple type error
  if (globalKey.trim() !== '*') return deepMerge(...globalPluginStyles)

  // @ts-expect-error TOFIX: Fix tuple type error
  if (!Array.isArray(preflightRules)) return deepMerge(...globalPluginStyles)

  const preflightStyles = preflightRules.flatMap(([, rule]) =>
    extractRuleStyles([rule], { ...params, passChecks: true })
  )

  // @ts-expect-error TOFIX: Fix tuple type error
  return deepMerge(...preflightStyles, ...globalPluginStyles)
}

export default getGlobalStyles
