import type { Config } from 'tailwindcss'
import type { TailwindConfig, TailwindContext, TailwindMatch } from 'core/types'

// @ts-expect-error Types added below
import { toPath as toPathRaw } from 'tailwindcss/lib/util/toPath'
// @ts-expect-error Types added below
import { resolveMatches as resolveMatchesRaw } from 'tailwindcss/lib/lib/generateRules'
// @ts-expect-error Types added below
import { createContext as createContextRaw } from 'tailwindcss/lib/lib/setupContextUtils'
// @ts-expect-error Types added below
import { default as defaultTailwindConfigRaw } from 'tailwindcss/stubs/config.full'
// @ts-expect-error Types added below
import { default as transformThemeValueRaw } from 'tailwindcss/lib/util/transformThemeValue'
// @ts-expect-error Types added below
import { default as resolveTailwindConfigRaw } from 'tailwindcss/lib/util/resolveConfig'
// @ts-expect-error Types added below
import { default as getAllConfigsRaw } from 'tailwindcss/lib/util/getAllConfigs'
// @ts-expect-error Types added below
import { splitAtTopLevelOnly as splitAtTopLevelOnlyRaw } from 'tailwindcss/lib/util/splitAtTopLevelOnly'
// @ts-expect-error Types added below
import unescapeRaw from 'postcss-selector-parser/dist/util/unesc'

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
const splitAtTopLevelOnly = splitAtTopLevelOnlyRaw as (
  input: string,
  separator: string
) => string[]
const unescape = unescapeRaw as (string: string) => string

export {
  toPath,
  createContext,
  defaultTailwindConfig,
  resolveMatches,
  transformThemeValue,
  resolveTailwindConfig,
  getAllConfigs,
  splitAtTopLevelOnly,
  unescape,
}
