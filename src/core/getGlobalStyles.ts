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
        return extractRuleStyles([rule], {
          ...params,
          coreContext: params,
          passChecks: true,
        })
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
    extractRuleStyles([rule], {
      ...params,
      coreContext: params,
      passChecks: true,
    })
  )

  return deepMerge(
    // @ts-expect-error TOFIX: Fix tuple type error
    ...preflightStyles,
    ...globalPluginStyles,
    ...globalKeyframeStyles(params)
  )
}

function globalKeyframeStyles(
  params: CoreContext
): Array<Record<string, unknown>> {
  if (params.twinConfig.moveKeyframesToGlobalStyles === false) return []
  const keyframes = params.theme('keyframes')
  if (!keyframes) return []

  return Object.entries(keyframes).map(
    ([name, frames]: [string, Record<string, unknown>]) => ({
      [`@keyframes ${name}`]: frames,
    })
  )
}

export default getGlobalStyles
