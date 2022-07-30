import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import escalade from 'escalade/sync'
import requireFresh from 'import-fresh'
import flatMap from 'lodash.flatmap'
import { configTwinValidators, configDefaultsTwin } from './twinConfig'
import defaultTwinConfig from './defaultTailwindConfig'
import { resolveTailwindConfig, defaultTailwindConfig } from './util/twImports'
import { logGeneralError } from './logging'
import throwIf from './util/throwIf'
import get from './util/get'
import toArray from './util/toArray'
import deepMerge from './util/deepMerge'

function getAllConfigs(config) {
  const configs = flatMap(
    [...get(config, 'presets', [defaultTailwindConfig])].reverse(),
    preset => {
      const config = typeof preset === 'function' ? preset() : preset
      return getAllConfigs(config)
    }
  )

  return [config, ...configs]
}

function getTailwindConfig({ sourceRoot, filename, config }) {
  sourceRoot = sourceRoot || '.'

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  const configFile = config && config.config

  const baseDirectory = filename ? dirname(filename) : process.cwd()

  const configPath = configFile
    ? resolve(sourceRoot, configFile)
    : escalade(baseDirectory, (_, names) => {
        if (names.includes('tailwind.config.js')) {
          return 'tailwind.config.js'
        }

        if (names.includes('tailwind.config.cjs')) {
          return 'tailwind.config.cjs'
        }
      })

  const configExists = configPath && existsSync(configPath)

  const configSelected = configExists
    ? requireFresh(configPath)
    : defaultTailwindConfig

  const mergedConfig = deepMerge({ ...defaultTwinConfig }, configSelected)

  const tailwindConfig = resolveTailwindConfig([...getAllConfigs(mergedConfig)])

  throwIf(!tailwindConfig, () =>
    logGeneralError(`Couldn’t find the Tailwind config.\nLooked in ${config}`)
  )

  return tailwindConfig
}

function runConfigValidator([item, value]) {
  const validatorConfig = configTwinValidators[item]
  if (!validatorConfig) return true

  const [validator, errorMessage] = validatorConfig

  throwIf(validator(value) !== true, () => logGeneralError(errorMessage))

  return true
}

function getConfigTwin(config, params) {
  return {
    ...configDefaultsTwin(params),
    ...config,
  }
}

function getConfigTwinValidated(config, params) {
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.entries(getConfigTwin(config, params)).reduce(
    (result, item) => ({
      ...result,
      ...(runConfigValidator(item) && { [item[0]]: item[1] }),
    }),
    {}
  )
}

function getCoercedTypesByProperty(property) {
  const config = getFlatCoercedConfigByProperty(property)
  if (!config) return []
  return Object.keys(config)
}

function getFlatCoercedConfigByProperty(property) {
  const coreConfig = getCorePluginsByProperty(property)
  const config = coreConfig.map(item => item.coerced).filter(Boolean)
  if (config.length === 0) return

  return Object.assign({}, ...config)
}

function filterCorePlugins(corePlugins) {
  return Object.entries(corePlugins).filter(
    ([, value]) => typeof value !== 'function'
  )
}

function getCorePluginsByProperty(propertyName) {
  const match = filterCorePlugins('corePlugins').find(
    ([k]) => propertyName === k
  )

  if (!match) return []
  const found = match[1]
  return toArray(found)
}

function supportsArbitraryValues(coreConfigValue) {
  return toArray(coreConfigValue).some(
    config =>
      (config.output && typeof config.output === 'function') ||
      (!config.output && config.coerced) ||
      config.config
  )
}

export {
  getTailwindConfig,
  getConfigTwinValidated,
  getCoercedTypesByProperty,
  getFlatCoercedConfigByProperty,
  getCorePluginsByProperty,
  supportsArbitraryValues,
}
