// eslint-disable-next-line import/no-relative-parent-imports
import type { TailwindContext, TailwindMatch } from '../types'

export function extractClassCandidates(
  tailwindContext: TailwindContext
): Set<[string, TailwindMatch[]]> {
  const candidates = new Set<[string, TailwindMatch[]]>()

  for (const candidate of tailwindContext.candidateRuleMap) {
    if (String(candidate[0]) !== '*') candidates.add(candidate)
  }

  return candidates
}

export function extractVariantCandidates(
  tailwindContext: TailwindContext
): Set<string> {
  const candidates = new Set<string>()

  for (const candidate of tailwindContext.variantMap) {
    if (candidate[0]) candidates.add(candidate[0])
  }

  return candidates
}
