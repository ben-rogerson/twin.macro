import { resolve, relative, parse } from 'path'
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
  const path = configExists ? require(configPath) : defaultTailwindConfig
  const configTailwind = resolveTailwindConfig([...getAllConfigs(path)])

  throwIf(!configTailwind, () =>
    logGeneralError(`Couldn’t find the Tailwind config.\nLooked in ${config}`)
  )

  return { configExists, configTailwind, configPath }
}

const checkExists = (fileName, sourceRoot) => {
  const fileNames = Array.isArray(fileName) ? fileName : [fileName]
  let configPath
  fileNames.find(fileName => {
    const resolved = resolve(sourceRoot, `./${fileName}`)
    const exists = existsSync(resolved)
    if (exists) configPath = resolved
    return exists
  })
  return configPath
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

export {
  getConfigTailwindProperties,
  getStitchesPath,
  resolveTailwindConfig,
  defaultTailwindConfig,
  getConfigTwinValidated,
}
