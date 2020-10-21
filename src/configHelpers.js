import { MacroError } from 'babel-plugin-macros'
import { resolve } from 'path'
import { existsSync } from 'fs'
import resolveTailwindConfig from 'tailwindcss/lib/util/resolveConfig'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub'
import { configTwinValidators, configTwinDefaults } from './config/twinConfig'
import { logGeneralError } from './logging'
import { assert } from './utils'

const getConfigTailwindProperties = (state, config) => {
  const sourceRoot = state.file.opts.sourceRoot || '.'
  const configFile = config && config.config

  const configPath = resolve(sourceRoot, configFile || `./tailwind.config.js`)
  const configExists = existsSync(configPath)
  const configTailwind = configExists
    ? resolveTailwindConfig([require(configPath), defaultTailwindConfig])
    : resolveTailwindConfig([defaultTailwindConfig])
  if (!configTailwind) {
    throw new MacroError(`Couldn’t find the Tailwind config`)
  }

  return { configPath, configExists, configTailwind }
}

const runConfigValidator = ([item, value]) => {
  const validatorConfig = configTwinValidators[item]
  if (!validatorConfig) return true

  const [validator, errorMessage] = validatorConfig

  assert(validator(value) !== true, () => logGeneralError(errorMessage))

  return true
}

const getConfigTwin = (config, state) => ({
  ...configTwinDefaults(state),
  ...config,
})

const getConfigTwinValidated = (config, state) =>
  Object.entries(getConfigTwin(config, state)).reduce(
    (result, item) => ({
      ...result,
      ...(runConfigValidator(item) && { [item[0]]: item[1] }),
    }),
    {}
  )

export {
  getConfigTailwindProperties,
  resolveTailwindConfig,
  defaultTailwindConfig,
  getConfigTwinValidated,
}
