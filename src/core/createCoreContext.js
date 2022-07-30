import { getTailwindConfig, getConfigTwinValidated } from './lib/configHelpers'
import getStitchesPath from './lib/getStitchesPath'
import userPresets from './lib/userPresets'
import createTheme from './lib/createTheme'
import createAssert from './lib/createAssert'
import { createDebug } from './lib/logging'
import { createContext } from './lib/util/twImports'

function packageCheck(packageToCheck, params) {
  return (
    params.config.preset === packageToCheck ||
    params.styledImport.from.includes(packageToCheck) ||
    params.cssImport.from.includes(packageToCheck)
  )
}

function getPackageUsed(params) {
  return {
    isEmotion: packageCheck('emotion', params),
    isStyledComponents: packageCheck('styled-components', params),
    isGoober: packageCheck('goober', params),
    isStitches: packageCheck('stitches', params),
  }
}

function getStyledConfig({ sourceRoot, filename, config }) {
  const usedConfig =
    (config.styled && config) ||
    userPresets[config.preset] ||
    userPresets.emotion

  if (typeof usedConfig.styled === 'string') {
    return { import: 'default', from: usedConfig.styled }
  }

  if (config.preset === 'stitches') {
    const stitchesPath = getStitchesPath({ sourceRoot, filename, config })
    if (stitchesPath) {
      // Overwrite the stitches import data with the path from the current file
      usedConfig.styled.from = stitchesPath
    }
  }

  return usedConfig.styled
}

function getCssConfig({ sourceRoot, filename, config }) {
  const usedConfig =
    (config.css && config) || userPresets[config.preset] || userPresets.emotion

  if (typeof usedConfig.css === 'string') {
    return { import: 'css', from: usedConfig.css }
  }

  if (config.preset === 'stitches') {
    const stitchesPath = getStitchesPath({ sourceRoot, filename, config })
    if (stitchesPath) {
      // Overwrite the stitches import data with the path from the current file
      usedConfig.css.from = stitchesPath
    }
  }

  return usedConfig.css
}

function getGlobalConfig(config) {
  const usedConfig =
    (config.global && config) ||
    userPresets[config.preset] ||
    userPresets.emotion
  return usedConfig.global
}

function createCoreContext(params) {
  const { sourceRoot, filename, config, isDev, CustomError = Error } = params

  const configParameters = { sourceRoot, filename, config }
  const styledImport = getStyledConfig(configParameters)
  const cssImport = getCssConfig(configParameters)
  const tailwindConfig = getTailwindConfig(configParameters)
  const packageUsed = getPackageUsed({ config, cssImport, styledImport })
  const twinConfig = getConfigTwinValidated(config, { ...packageUsed, isDev })
  const importConfig = {
    styled: styledImport,
    css: cssImport,
    global: getGlobalConfig(config),
  }

  return {
    isDev,
    assert: createAssert(CustomError, false),
    debug: createDebug(isDev, twinConfig),
    theme: createTheme(tailwindConfig),
    tailwindContext: createContext(tailwindConfig),
    packageUsed,
    tailwindConfig,
    twinConfig,
    CustomError,
    importConfig,
  }
}

export default createCoreContext
