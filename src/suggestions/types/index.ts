import type colors from '../lib/colors'
import type {
  TailwindMatch,
  TailwindContext,
  TailwindConfig,
} from '../../core/types'

export type Options = {
  CustomError: typeof Error
  tailwindContext: TailwindContext
  tailwindConfig: TailwindConfig
  hasColor?: boolean
  suggestionNumber?: number
}

export type ClassErrorContext = {
  color: MakeColor
  candidates: Set<[string, TailwindMatch[]]>
  variants: Set<string>
} & Pick<
  Options,
  'suggestionNumber' | 'CustomError' | 'tailwindConfig' | 'tailwindContext'
>

export type MakeColor = (message: string, type: keyof typeof colors) => string

export type { TailwindMatch, TailwindContext, TailwindConfig }
