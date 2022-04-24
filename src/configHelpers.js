import { resolve, relative, parse } from 'path'
import { existsSync } from 'fs'
import resolveTailwindConfig from 'tailwindcss/lib/util/resolveConfig'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub'
import { configTwinValidators, configDefaultsTwin } from './config/twinConfig'
import corePlugins from './config/corePlugins'
import flatMap from 'lodash.flatmap'
import { logGeneralError } from './logging'
import { throwIf, get, toArray, getFirstValue } from './utils'

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

// Fix: Warning Tailwind throws when the content key is empty
const silenceContentWarning = config => ({
  ...(!config.content && { content: [''] }),
  ...config,
})

const getConfigTailwindProperties = (state, config) => {
  const sourceRoot = state.file.opts.sourceRoot || '.'
  const configFile = config && config.config

  const configPath = resolve(sourceRoot, configFile || './tailwind.config.js')
  const configExists = existsSync(configPath)

  // Look for a commonjs file as a fallback
  if (!configExists && !configFile)
    return getConfigTailwindProperties(state, {
      ...config,
      config: './tailwind.config.cjs',
    })

  const configSelected = configExists
    ? require(configPath)
    : defaultTailwindConfig

  const configUser = silenceContentWarning(configSelected)
  const configTailwind = resolveTailwindConfig([...getAllConfigs(configUser)])

  throwIf(!configTailwind, () =>
    logGeneralError(`Couldn’t find the Tailwind config.\nLooked in ${config}`)
  )

  return { configExists, configTailwind, configPath }
}

const checkExists = (fileName, sourceRoot) => {
  const [, value] = getFirstValue(toArray(fileName), fileName =>
    existsSync(resolve(sourceRoot, `./${fileName}`))
  )
  return value
}

const getRelativePath = ({ comparePath, state }) => {
  const { filename } = state.file.opts
  const pathName = parse(filename).dir
  return relative(pathName, comparePath)
}

const getStitchesPath = (state, config) => {
  const sourceRoot = state.file.opts.sourceRoot || '.'

  const configPathCheck = config.stitchesConfig || [
    'stitches.config.ts',
    'stitches.config.js',
  ]
  const configPath = checkExists(configPathCheck, sourceRoot)
  throwIf(!configPath, () =>
    logGeneralError(
      `Couldn’t find the Stitches config at ${
        config.stitchesConfig
          ? `“${config.stitchesConfig}”`
          : 'the project root'
      }.\nUse the twin config: stitchesConfig="PATH_FROM_PROJECT_ROOT" to set the location.`
    )
  )

  return getRelativePath({ comparePath: configPath, state })
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

const getCoercedTypesByProperty = property => {
  const config = getFlatCoercedConfigByProperty(property)
  if (!config) return []
  return Object.keys(config)
}

const getFlatCoercedConfigByProperty = property => {
  const coreConfig = getCorePluginsByProperty(property)
  const config = coreConfig.map(i => i.coerced).filter(Boolean)
  if (config.length === 0) return

  return Object.assign({}, ...config)
}

const getCorePluginsByProperty = propertyName => {
  const match = Object.entries(corePlugins).find(([k]) => propertyName === k)
  if (!match) return []
  const found = match[1]
  return toArray(found)
}

const supportsArbitraryValues = coreConfigValue =>
  toArray(coreConfigValue).some(
    config =>
      (config.output && typeof config.output === 'function') ||
      (!config.output && config.coerced) ||
      config.config
  )

export {
  getConfigTailwindProperties,
  getStitchesPath,
  getConfigTwinValidated,
  getCoercedTypesByProperty,
  getFlatCoercedConfigByProperty,
  getCorePluginsByProperty,
  supportsArbitraryValues,
}
