/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { getTailwindConfig, getConfigTwinValidated } from './lib/configHelpers'
import getStitchesPath from './lib/getStitchesPath'
import userPresets from './lib/userPresets'
import createTheme from './lib/createTheme'
import createAssert from './lib/createAssert'
import { createDebug } from './lib/logging'
import { createContext } from './lib/util/twImports'
import type {
  PresetItem,
  GetPackageUsed,
  PossiblePresets,
  CoreContext,
  CreateCoreContext,
  TwinConfig,
  Assert,
} from './types'

function packageCheck(
  packageToCheck: PossiblePresets,
  params: GetPackageConfig
): boolean {
  return (
    (params.config && params.config.preset === packageToCheck) ||
    params.styledImport.from.includes(packageToCheck) ||
    params.cssImport.from.includes(packageToCheck)
  )
}

type GetPackageConfig = {
  config?: TwinConfig
  cssImport: PresetItem
  styledImport: PresetItem
}

function getPackageUsed(params: GetPackageConfig): GetPackageUsed {
  return {
    isEmotion: packageCheck('emotion', params),
    isStyledComponents: packageCheck('styled-components', params),
    isGoober: packageCheck('goober', params),
    isStitches: packageCheck('stitches', params),
  }
}

type ConfigParameters = {
  sourceRoot?: string
  filename: string
  config?: TwinConfig
  assert: Assert
}

function getStyledConfig({
  sourceRoot,
  filename,
  config,
}: ConfigParameters): PresetItem {
  const usedConfig =
    (config?.styled && config) ||
    (config?.preset && userPresets[config.preset]) ||
    userPresets.emotion

  if (typeof usedConfig.styled === 'string') {
    return { import: 'default', from: usedConfig.styled }
  }

  if (config && config.preset === 'stitches') {
    const stitchesPath = getStitchesPath({ sourceRoot, filename, config })
    if (stitchesPath && usedConfig.styled) {
      // Overwrite the stitches import data with the path from the current file
      usedConfig.styled.from = stitchesPath
    }
  }

  return usedConfig.styled as PresetItem
}

function getCssConfig({
  sourceRoot,
  filename,
  config,
}: ConfigParameters): PresetItem {
  const usedConfig =
    (config?.css && config) ||
    (config?.preset && userPresets[config.preset]) ||
    userPresets.emotion

  if (typeof usedConfig.css === 'string') {
    return { import: 'css', from: usedConfig.css }
  }

  if (config && config.preset === 'stitches') {
    const stitchesPath = getStitchesPath({ sourceRoot, filename, config })
    if (stitchesPath && usedConfig.css) {
      // Overwrite the stitches import data with the path from the current file
      usedConfig.css.from = stitchesPath
    }
  }

  return usedConfig.css as PresetItem
}

function getGlobalConfig(config: TwinConfig): PresetItem {
  const usedConfig =
    (config.global && config) ||
    (config.preset && userPresets[config.preset]) ||
    userPresets.emotion
  return usedConfig.global as PresetItem
}

function createCoreContext(params: CreateCoreContext): CoreContext {
  const { sourceRoot, filename, config, isDev = false, CustomError } = params
  const assert = createAssert(CustomError, false, config?.hasLogColors)
  const configParameters = {
    sourceRoot,
    assert,
    filename: filename ?? '',
    config,
  }
  const styledImport = getStyledConfig(configParameters)
  const cssImport = getCssConfig(configParameters)
  const tailwindConfig =
    params.tailwindConfig ?? getTailwindConfig(configParameters)

  const packageUsed = getPackageUsed({ config, cssImport, styledImport })
  const twinConfig = getConfigTwinValidated(config, { ...packageUsed, isDev })
  const importConfig = {
    styled: styledImport,
    css: cssImport,
    global: getGlobalConfig(config ?? {}),
  }

  return {
    isDev,
    assert,
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
