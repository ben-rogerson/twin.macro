import dlv from 'dlv'
import { transformThemeValue, toPath } from './util/twImports'
import isObject from './util/isObject'

const createTheme = tailwindConfig => {
  function getConfigValue(path, defaultValue) {
    return path ? dlv(tailwindConfig, path, defaultValue) : tailwindConfig
  }

  function resolveThemeValue(path, defaultValue, opts = {}) {
    const [pathRoot, ...subPaths] = toPath(path)
    const value = getConfigValue(['theme', pathRoot, ...subPaths], defaultValue)
    return sassifyValues(transformThemeValue(pathRoot)(value, opts))
  }

  //   const theme = Object.assign(
  //     // eslint-disable-next-line unicorn/no-useless-undefined
  //     (path, defaultValue = undefined) => resolveThemeValue(path, defaultValue),
  //     {
  //       withAlpha: (path, opacityValue) =>
  //         resolveThemeValue(path, undefined, { opacityValue }),
  //     }
  //   ) // TODO: Add withAlpha

  return (...opts) => resolveThemeValue(...opts)
}

const sassifyValues = values => {
  if (!isObject(values)) return values
  const transformed = Object.entries(values).map(([k, v]) => [
    k,
    (isObject(v) && sassifyValues(v)) ||
      (typeof v === 'number' && String(v)) || // Convert numbers to strings
      v,
  ])
  return Object.fromEntries(transformed)
}

export default createTheme
