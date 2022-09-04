import { validators } from './lib/validators'
import { getClassSuggestions } from './lib/getClassSuggestions'
import { makeColor } from './lib/makeColor'
import {
  extractClassCandidates,
  extractVariantCandidates,
} from './lib/extractors'
import { getPackageVersions } from './lib/getPackageVersions'
import type {
  ClassErrorContext,
  MakeColor,
  Options,
  TailwindContext,
  TailwindConfig,
} from './types'

const COLONS_OUTSIDE_BRACKETS =
  /:(?=(?:(?:(?!\)).)*\()|[^()]*$)(?=(?:(?:(?!]).)*\[)|[^[\]]*$)/g

const ALL_SPACE_IDS = /{{SPACE}}/g

const OPTION_DEFAULTS = {
  CustomError: Error,
  tailwindContext: undefined,
  tailwindConfig: undefined,
  hasLogColors: true,
  suggestionNumber: 5,
}

function getClassError(rawClass: string, context: ClassErrorContext): string {
  const classPieces = rawClass
    .replace(ALL_SPACE_IDS, ' ')
    .split(COLONS_OUTSIDE_BRACKETS)

  for (const validator of validators) {
    const error = validator(classPieces, context)
    if (error) return error
  }

  const className = classPieces.slice(-1).join('')
  return getClassSuggestions(className, context)
}

export type ErrorContext = {
  CustomError: typeof Error
  tailwindContext: TailwindContext
  tailwindConfig: TailwindConfig
  hasLogColors: boolean
  suggestionNumber: number
}

function createErrorContext(
  color: MakeColor,
  context: ErrorContext
): ClassErrorContext {
  return {
    color,
    candidates: extractClassCandidates(context.tailwindContext),
    variants: extractVariantCandidates(context.tailwindContext),
    suggestionNumber: context.suggestionNumber,
    CustomError: context.CustomError,
    tailwindConfig: context.tailwindConfig,
    tailwindContext: context.tailwindContext,
  }
}

function getSuggestions(classList: string[], options: Options): void {
  const context = { ...OPTION_DEFAULTS, ...options }
  const color = makeColor(context.hasLogColors)

  const classErrorContext = createErrorContext(color, context)

  const errorText = classList
    .map(c => getClassError(c, classErrorContext))
    .join('\n\n')

  const { twinVersion } = getPackageVersions()
  const helpText = [
    `${twinVersion ? `twin.macro@${twinVersion}` : 'twinVersion'}`,
    `https://twinredirect.page.link/docs`,
    `https://tailwindcss.com/docs`,
  ].join('\n')

  throw new context.CustomError(
    `\n\n${errorText}\n\n${color(helpText, 'subdued')}\n`
  )
}

export default getSuggestions
