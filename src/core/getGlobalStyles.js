import deepMerge from './lib/util/deepMerge'
import extractRuleStyles from './extractRuleStyles'
import { LAYER_DEFAULTS } from './constants'

function getGlobalStyles(params) {
  const candidates = [...params.tailwindContext.candidateRuleMap]

  const globalPluginStyles = candidates
    .flatMap(([, candidate]) => {
      const out = candidate.map(([data, rule]) => {
        if (data.layer !== LAYER_DEFAULTS) return
        return extractRuleStyles([rule], { ...params, passChecks: true })
      })
      if (out.length === 0) return

      return out
    })
    .filter(Boolean)

  const [globalKey, preflightRules] = candidates[0]
  if (globalKey.trim() !== '*') return deepMerge(...globalPluginStyles)

  const preflightStyles = preflightRules.flatMap(([, rule]) =>
    extractRuleStyles([rule], { ...params, passChecks: true })
  )

  return deepMerge(...preflightStyles, ...globalPluginStyles)
}

export default getGlobalStyles
