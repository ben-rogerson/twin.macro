import { MacroError } from 'babel-plugin-macros'
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
// eslint-disable-next-line import/no-relative-parent-imports
import { createCoreContext, getStyles, splitAtTopLevelOnly } from '../core'

const ALL_SPACE_IDS = /{{SPACE}}/g

const OPTION_DEFAULTS = {
  CustomError: Error,
  tailwindContext: undefined,
  tailwindConfig: undefined,
  hasLogColors: true,
  suggestionNumber: 5,
}

function getVariantSuggestions(
  variants: string[],
  className: string,
  context: ClassErrorContext
): string | undefined {
  const coreContext = createCoreContext({
    tailwindConfig: context?.tailwindConfig,
    CustomError: MacroError as typeof Error,
  })
  const { unmatched } = getStyles(className, coreContext)
  if (unmatched.length > 0) return

  const unmatchedVariants = variants.filter(v => {
    if (v.startsWith('[')) return v
    return !context.variants.has(v)
  })
  if (unmatchedVariants.length === 0) return

  const problemVariant = unmatchedVariants[0]
  return [
    `${context.color(
      `✕ Variant ${context.color(problemVariant, 'errorLight')} ${
        problemVariant.startsWith('[') ? 'can’t be used' : 'was not found'
      }`
    )}`,
  ].join('\n\n')
}

function getClassError(rawClass: string, context: ClassErrorContext): string {
  const input = rawClass.replace(ALL_SPACE_IDS, ' ')

  const classPieces = [
    ...splitAtTopLevelOnly(input, context.tailwindConfig.separator ?? ':'),
  ]

  for (const validator of validators) {
    const error = validator(classPieces, context)
    if (error) return error
  }

  const className = classPieces.slice(-1).join('')
  const variants = classPieces.slice(0, -1)

  // Check if variants or classes with match issues
  if (variants.length > 0) {
    const variantSuggestions = getVariantSuggestions(
      variants,
      className,
      context
    )
    if (variantSuggestions) return variantSuggestions
  }

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
