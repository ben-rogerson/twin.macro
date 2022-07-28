import { resolve, relative, parse } from 'path'
import { existsSync } from 'fs'
import { logGeneralError } from './logging'
import throwIf from './util/throwIf'
import toArray from './util/toArray'
import getFirstValue from './util/getFirstValue'

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

export default getStitchesPath
