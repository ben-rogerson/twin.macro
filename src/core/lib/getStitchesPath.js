import { resolve, relative, parse } from 'path'
import { existsSync } from 'fs'
import { logGeneralError } from './logging'
import throwIf from './util/throwIf'
import toArray from './util/toArray'
import getFirstValue from './util/getFirstValue'

function checkExists(fileName, sourceRoot) {
  const [, value] = getFirstValue(toArray(fileName), fileName =>
    existsSync(resolve(sourceRoot, `./${fileName}`))
  )
  return value
}

function getRelativePath({ comparePath, filename }) {
  const pathName = parse(filename).dir
  return relative(pathName, comparePath)
}

function getStitchesPath({ sourceRoot, filename, config }) {
  sourceRoot = sourceRoot || '.'

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

  return getRelativePath({ comparePath: configPath, filename })
}

export default getStitchesPath
