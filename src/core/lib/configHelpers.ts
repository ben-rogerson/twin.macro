import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import escalade from 'escalade/sync'
import requireFresh from 'import-fresh'
import { configTwinValidators, configDefaultsTwin } from './twinConfig'
import defaultTwinConfig from './defaultTailwindConfig'
import { resolveTailwindConfig, getAllConfigs } from './util/twImports'
import isObject from './util/isObject'
import { logGeneralError } from './logging'
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

  const userTailwindConfig = config?.config

  if (isObject(userTailwindConfig))
    return resolveTailwindConfig([
      // User config
      ...getAllConfigs(userTailwindConfig as Record<string, unknown[]>),
      // Default config
      ...getAllConfigs(defaultTwinConfig),
    ])

  const configPath = userTailwindConfig
    ? resolve(sourceRoot, userTailwindConfig)
    : escalade(baseDirectory, (_, names) => {
        if (names.includes('tailwind.config.js')) {
          return 'tailwind.config.js'
        }

        if (names.includes('tailwind.config.cjs')) {
          return 'tailwind.config.cjs'
        }
      })

  const configExists = Boolean(configPath && existsSync(configPath))

  if (userTailwindConfig)
    assert(configExists, ({ color }: AssertContext) =>
      [
        `${String(
          color(
            `✕ The tailwind config ${color(
              String(userTailwindConfig),
              'errorLight'
            )} wasn’t found`
          )
        )}`,
        `Update the \`config\` option in your twin config`,
      ].join('\n\n')
    )

  const configs = [
    // User config
    ...(configExists ? getAllConfigs(requireFresh(configPath as string)) : []),
    // Default config
    ...getAllConfigs(defaultTwinConfig),
  ]

  const tailwindConfig = resolveTailwindConfig(configs)

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
