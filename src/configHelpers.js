import { MacroError } from 'babel-plugin-macros'
import { resolve } from 'path'
import { existsSync } from 'fs'
import resolveTailwindConfig from 'tailwindcss/lib/util/resolveConfig'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub'
import { configTwinValidators, configDefaultsTwin } from './config/twinConfig'
import flatMap from 'lodash.flatmap'
import { logGeneralError } from './logging'
import { throwIf, get } from './utils'

const getAllConfigs = config => {
  const configs = flatMap(
    [...get(config, 'presets', [defaultTailwindConfig])].reverse(),
    preset => {
      const config = typeof preset === 'function' ? preset() : preset
      return getAllConfigs(config)
    }
  )

  return [config, ...configs]
}

const getConfigTailwindProperties = (state, config) => {
  const sourceRoot = state.file.opts.sourceRoot || '.'
  const configFile = config && config.config

  const configPath = resolve(sourceRoot, configFile || `./tailwind.config.js`)
  const configExists = existsSync(configPath)

  const configTailwind = configExists
    ? resolveTailwindConfig([...getAllConfigs(require(configPath))])
    : resolveTailwindConfig([...getAllConfigs(defaultTailwindConfig)])

  if (!configTailwind) {
    throw new MacroError(`Couldn’t find the Tailwind config`)
  }

  return { configExists, configTailwind }
}

const runConfigValidator = ([item, value]) => {
  const validatorConfig = configTwinValidators[item]
  if (!validatorConfig) return true

  const [validator, errorMessage] = validatorConfig

  throwIf(validator(value) !== true, () => logGeneralError(errorMessage))

  return true
}

const getConfigTwin = (config, state) => ({
  ...configDefaultsTwin(state),
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
