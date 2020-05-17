import {
  resolveTailwindConfig,
  defaultTailwindConfig,
} from './../configHelpers'

let resolvedConfig

export default config => {
  if (resolvedConfig) return resolvedConfig
  resolvedConfig = resolveTailwindConfig([config, defaultTailwindConfig])
  return resolvedConfig
}
