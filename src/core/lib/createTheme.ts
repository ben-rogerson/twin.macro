import dlv from 'dlv'
import { transformThemeValue, toPath } from './util/twImports'
import isObject from './util/isObject'
import type { TailwindConfig } from 'core/types'

function createTheme(
  tailwindConfig: TailwindConfig
): (
  dotSeparatedItem: string,
  extra?: string
) => Record<string, unknown> | boolean | number {
  function getConfigValue(path: string[], defaultValue?: string): unknown {
    return path ? dlv(tailwindConfig, path, defaultValue) : tailwindConfig
  }

  function resolveThemeValue(
    path: string[],
    defaultValue?: string,
    options = {}
  ): Record<string, unknown> | undefined {
    if (!path) return
    const [pathRoot, ...subPaths] = toPath(path)
    const value = getConfigValue(['theme', pathRoot, ...subPaths], defaultValue)
    return sassifyValues(transformThemeValue(pathRoot)(value, options))
  }

  // @ts-expect-error TOFIX
  // TODO: Complete the new theme functionality
  return (...options) => resolveThemeValue(...options)
}

function sassifyValues(
  values: Record<string, unknown>
): Record<string, unknown> {
  if (!isObject(values)) return values
  const transformed: Array<[string, unknown]> = Object.entries(values).map(
    ([k, v]: [string, unknown]) => [
      k,
      // @ts-expect-error TOFIX: ts doesn't understand isObject
      (isObject(v) && sassifyValues(v)) ||
        (typeof v === 'number' && String(v)) ||
        v,
    ]
  )
  return Object.fromEntries(transformed)
}

export default createTheme
