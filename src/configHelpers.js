import { MacroError } from 'babel-plugin-macros'
import { resolve } from 'path'
import { existsSync } from 'fs'
import resolveTailwindConfig from 'tailwindcss/lib/util/resolveConfig'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub'

const getConfigProperties = (state, config) => {
  const sourceRoot = state.file.opts.sourceRoot || '.'
  const configFile = config && config.config

  const configPath = resolve(sourceRoot, configFile || `./tailwind.config.js`)
  const configExists = existsSync(configPath)
  const tailwindConfig = configExists
    ? resolveTailwindConfig([require(configPath), defaultTailwindConfig])
    : resolveTailwindConfig([defaultTailwindConfig])
  if (!tailwindConfig) {
    throw new MacroError(`Couldn’t find the Tailwind config`)
  }

  return {
    configPath,
    configExists,
    tailwindConfig,
  }
}

export { getConfigProperties, resolveTailwindConfig, defaultTailwindConfig }
