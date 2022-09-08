import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import escalade from 'escalade/sync'
import requireFresh from 'import-fresh'
import { configTwinValidators, configDefaultsTwin } from './twinConfig'
import defaultTwinConfig from './defaultTailwindConfig'
import {
  resolveTailwindConfig,
  defaultTailwindConfig,
  getAllConfigs,
} from './util/twImports'
import { logGeneralError } from './logging'
import deepMerge from './util/deepMerge'
import type {
  TwinConfig,
  TwinConfigAll,
  GetConfigTwinValidatedParameters,
  TailwindConfig,
  Assert,
  AssertContext,
} from 'core/types'

type Validator = [(value: unknown) => boolean, string]

type GetTailwindConfig = {
  sourceRoot?: string
  filename: string
  config?: TwinConfig
  assert: Assert
}

function getTailwindConfig({
  sourceRoot,
  filename,
  config,
  assert,
}: GetTailwindConfig): TailwindConfig {
  sourceRoot = sourceRoot ?? '.'

  const baseDirectory = filename ? dirname(filename) : process.cwd()

  const configPath = config?.config
    ? resolve(sourceRoot, config.config)
    : escalade(baseDirectory, (_, names) => {
        if (names.includes('tailwind.config.js')) {
          return 'tailwind.config.js'
        }

        if (names.includes('tailwind.config.cjs')) {
          return 'tailwind.config.cjs'
        }
      })

  const configExists = configPath && existsSync(configPath)

  if (config?.config)
    assert(Boolean(configExists), ({ color }: AssertContext) =>
      [
        `${String(
          color(
            `✕ The tailwind config ${color(
              String(config?.config),
              'errorLight'
            )} wasn’t found`
          )
        )}`,
        `Update the \`config\` option in your twin config`,
      ].join('\n\n')
    )

  const configSelected: Record<string, unknown[]> = configExists
    ? requireFresh(configPath)
    : defaultTailwindConfig

  const mergedConfig = deepMerge({ ...defaultTwinConfig }, configSelected)

  const tailwindConfig = resolveTailwindConfig([...getAllConfigs(mergedConfig)])
  return tailwindConfig
}

function runConfigValidator([item, value]: [
  keyof typeof configTwinValidators,
  string | boolean
]): boolean {
  const validatorConfig: Validator = configTwinValidators[item]
  if (!validatorConfig) return true

  const [validator, errorMessage] = validatorConfig

  if (typeof validator !== 'function') return false

  if (!validator(value)) {
    throw new Error(logGeneralError(String(errorMessage)))
  }

  return true
}

function getConfigTwin(
  config: TwinConfig | undefined,
  params: GetConfigTwinValidatedParameters
): TwinConfigAll {
  const output: TwinConfigAll = {
    ...configDefaultsTwin(params),
    ...config,
  }
  return output
}

function getConfigTwinValidated(
  config: TwinConfig | undefined,
  params: GetConfigTwinValidatedParameters
): TwinConfigAll {
  const twinConfig = getConfigTwin(config, params)
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.entries(twinConfig).reduce((result, item) => {
    const validatedItem = item as [
      keyof typeof configTwinValidators,
      string | boolean
    ]
    return {
      ...result,
      ...(runConfigValidator(validatedItem) && {
        [validatedItem[0]]: validatedItem[1],
      }),
    }
  }, {}) as TwinConfigAll
}

export { getTailwindConfig, getConfigTwinValidated }
