import type { Config } from 'tailwindcss'
import type {
  TailwindConfig,
  TailwindContext,
  TailwindMatch,
  // eslint-disable-next-line import/no-relative-parent-imports
} from '../../types'

// @ts-expect-error Types added below
import { toPath as toPathRaw } from 'tailwindcss/lib/util/toPath'
// @ts-expect-error Types added below
import { resolveMatches as resolveMatchesRaw } from 'tailwindcss/lib/lib/generateRules'
// @ts-expect-error Types added below
import { createContext as createContextRaw } from 'tailwindcss/lib/lib/setupContextUtils'
// @ts-expect-error Types added below
import { default as defaultTailwindConfigRaw } from 'tailwindcss/stubs/defaultConfig.stub'
// @ts-expect-error Types added below
import { default as transformThemeValueRaw } from 'tailwindcss/lib/util/transformThemeValue'
// @ts-expect-error Types added below
import { default as resolveTailwindConfigRaw } from 'tailwindcss/lib/util/resolveConfig'
// @ts-expect-error Types added below
import { default as getAllConfigsRaw } from 'tailwindcss/lib/util/getAllConfigs'

const toPath = toPathRaw as (path: string[] | string) => string[]
const createContext = createContextRaw as (config: Config) => TailwindContext
const defaultTailwindConfig = defaultTailwindConfigRaw as Config
const resolveMatches = resolveMatchesRaw as (
  candidate: string,
  context: TailwindContext
) => TailwindMatch[]
const transformThemeValue = transformThemeValueRaw as (
  themeValue: string
) => (
  value: unknown,
  options: Record<string, unknown>
) => Record<string, unknown>
const resolveTailwindConfig = resolveTailwindConfigRaw as (
  config: unknown[]
) => TailwindConfig
const getAllConfigs = getAllConfigsRaw as (
  config: Record<string, unknown[]>
) => TailwindConfig[]

export {
  toPath,
  createContext,
  defaultTailwindConfig,
  resolveMatches,
  transformThemeValue,
  resolveTailwindConfig,
  getAllConfigs,
}
