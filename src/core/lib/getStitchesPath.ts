import { resolve, relative, parse } from 'path'
import { existsSync } from 'fs'
import { logGeneralError } from './logging'
import toArray from './util/toArray'
import type { TwinConfig } from 'core/types'

function getFirstValue<ListItem>(
  list: ListItem[],
  getValue: (
    params: ListItem,
    options: { index: number; isLast: boolean }
  ) => unknown
): [unknown, ListItem | undefined] {
  let firstValue
  const listLength = list.length - 1
  const listItem = list.find((listItem, index) => {
    const isLast = index === listLength
    firstValue = getValue(listItem, { index, isLast })
    return Boolean(firstValue)
  })

  return [firstValue, listItem]
}

function checkExists(
  fileName: string | string[],
  sourceRoot: string
): string | undefined {
  const [, value] = getFirstValue(
    toArray(fileName) as string[],
    existingFileName => existsSync(resolve(sourceRoot, `./${existingFileName}`))
  )
  return value
}

function getRelativePath(comparePath: string, filename: string): string {
  const pathName = parse(filename).dir
  return relative(pathName, comparePath)
}

function getStitchesPath({
  sourceRoot,
  filename,
  config,
}: {
  sourceRoot?: string
  filename: string
  config: TwinConfig
}): string {
  sourceRoot = sourceRoot ?? '.'

  const configPathCheck = config.stitchesConfig ?? [
    'stitches.config.ts',
    'stitches.config.js',
  ]

  const configPath = checkExists(configPathCheck, sourceRoot)
  if (!configPath)
    throw new Error(
      logGeneralError(
        `Couldn’t find the Stitches config at ${
          config.stitchesConfig
            ? `“${String(config.stitchesConfig)}”`
            : 'the project root'
        }.\nUse the twin config: stitchesConfig="PATH_FROM_PROJECT_ROOT" to set the location.`
      )
    )

  return getRelativePath(configPath, filename)
}

export default getStitchesPath
