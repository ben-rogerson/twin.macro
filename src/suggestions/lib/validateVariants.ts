import stringSimilarity from 'string-similarity'
// eslint-disable-next-line import/no-relative-parent-imports
import type { ClassErrorContext } from '../types'

export function validateVariants(
  variants: string[],
  context: ClassErrorContext
): string | undefined {
  const variantCandidates = [...context.variants]

  const variantMatch = variants[0] // TODO: Loop over variants
  if (!variantMatch) return

  // Exact variant match
  if (variantCandidates.includes(variantMatch)) return

  const results = variantCandidates
    .map((variant: string): [string, number] | undefined => {
      const rating = variantMatch
        ? Number(stringSimilarity.compareTwoStrings(variant, variantMatch))
        : 0
      if (rating < 0.2) return

      return [variant, rating]
    })
    .filter(Boolean) as Array<[string, number]>

  const errorText = `${context.color(
    `✕ ${context.color(`${variantMatch}:`, 'errorLight')} was not found`,
    'error'
  )}`

  if (results.length === 0) return errorText

  const suggestions = results
    .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
    .slice(0, 4)
    .map(([i]: [string, number]): string => `${i}:`)

  const showMore = results.length > 2 && results[0][1] - results[1][1] < 0.1

  const suggestionText =
    suggestions.length > 0
      ? [
          `Did you mean ${context.color(
            suggestions.slice(0, 1).join(''),
            'success'
          )} ?`,
          showMore &&
            `More variants\n${suggestions
              .slice(1)
              .map(v => `${context.color('-', 'subdued')} ${v}`)
              .join('\n')}`,
        ]
          .filter(Boolean)
          .join('\n\n')
      : ''

  return [errorText, suggestionText].join('\n\n')
}
