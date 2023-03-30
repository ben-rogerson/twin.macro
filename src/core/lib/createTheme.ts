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
    return dlv(tailwindConfig, path, defaultValue)
  }

  function resolveThemeValue(
    path: string,
    defaultValue?: string,
    options = {}
  ): number | boolean | Record<string, unknown> {
    const [pathRoot, ...subPaths] = toPath(path)

    const value = getConfigValue(
      path ? ['theme', pathRoot, ...subPaths] : ['theme'],
      defaultValue
    )
    return sassifyValues(transformThemeValue(pathRoot)(value, options))
  }

  const out = Object.assign(
    (path: string, defaultValue?: string) =>
      resolveThemeValue(path, defaultValue),
    {
      withAlpha: (path: string, opacityValue?: string) =>
        resolveThemeValue(path, undefined, { opacityValue }),
    }
  )

  return out
}

function sassifyValues(
  values: Record<string, unknown>
): Record<string, unknown> {
  if (!isObject(values)) return values
  const transformed: Array<[string, unknown]> = Object.entries(values).map(
    ([k, v]: [string, unknown]) => [
      k,
      (isObject(v) && sassifyValues(v)) ||
        (typeof v === 'number' && String(v)) ||
        v,
    ]
  )
  return Object.fromEntries(transformed)
}

export default createTheme
