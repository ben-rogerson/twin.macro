import stringSimilarity from 'string-similarity'
import type { ClassErrorContext } from 'suggestions/types'

const RATING_MINIMUM = 0.2

type RateCandidate = [number, string, string]

function rateCandidate(
  classData: [string, string],
  className: string,
  matchee: string
): RateCandidate | undefined {
  const [classEnd, value] = classData

  const candidate = `${[className, classEnd === 'DEFAULT' ? '' : classEnd]
    .filter(Boolean)
    .join('-')}`

  const rating = Number(stringSimilarity.compareTwoStrings(matchee, candidate))
  if (rating < RATING_MINIMUM) return

  const classValue = `${String(
    (typeof value === 'string' && (value.length === 0 ? `''` : value)) ??
      JSON.stringify(value)
  )}${classEnd === 'DEFAULT' ? ' (DEFAULT)' : ''}`

  return [rating, candidate, classValue]
}

function extractCandidates(
  candidates: ClassErrorContext['candidates'],
  matchee: string
): RateCandidate[] {
  const results = [] as RateCandidate[]

  for (const [className, classOptionSet] of candidates) {
    for (const classOption of classOptionSet) {
      const { options } = classOption[0]
      if (options?.values) {
        // Dynamic classes like mt-xxx, bg-xxx
        for (const value of Object.entries(options?.values)) {
          const rated = rateCandidate(value, className, matchee)
          // eslint-disable-next-line max-depth
          if (rated) results.push(rated)
        }
      } else {
        // Non-dynamic classes like fixed, block
        const rated = rateCandidate(['', className], className, matchee)
        if (rated) results.push(rated)
      }
    }
  }

  return results
}

export function getClassSuggestions(
  matchee: string,
  context: ClassErrorContext
): string {
  const { color } = context

  const candidates = extractCandidates(context.candidates, matchee)

  const errorText = `${context.color(
    `✕ ${context.color(matchee, 'errorLight')} was not found`,
    'error'
  )}`

  if (candidates.length === 0) return errorText

  candidates.sort(
    ([a]: [number, string, string], [b]: [number, string, string]) => b - a
  )

  const [firstSuggestion, secondSuggestion = []] = candidates
  const [firstRating, firstCandidate, firstClassValue] = firstSuggestion
  const [secondRating] = secondSuggestion as RateCandidate

  const hasWinningSuggestion =
    ((secondSuggestion as RateCandidate).length > 0 &&
      firstRating - secondRating > 0.12) ??
    false

  if (candidates.length === 1 || hasWinningSuggestion) {
    const valueText =
      firstClassValue === firstCandidate ? '' : ` (${firstClassValue})`
    return [
      errorText,
      `Did you mean ${color(firstCandidate, 'success')} ?${valueText}`,
    ].join('\n\n')
  }

  const suggestions = candidates
    .slice(0, context.suggestionNumber)
    .map(
      ([, suggestion, value]: [number, string, string]): string =>
        `${color('-', 'subdued')} ${color(suggestion, 'highlight')} ${color(
          '>',
          'subdued'
        )} ${value}`
    )
  return [errorText, 'Try one of these classes:', suggestions.join('\n')].join(
    '\n\n'
  )
}
