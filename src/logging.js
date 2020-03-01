import dlv from 'dlv'
import chalk from 'chalk'
import { staticStyles, dynamicStyles } from './config'
import { isEmpty } from './utils'

const spaced = string => `\n\n${string}\n\n`
const warning = string => chalk.bgBlack(chalk.redBright(`✕ ${string}`))

const getClassNamePieces = className => {
  const classNamePieces = className.split('-')
  return classNamePieces.length > 1
    ? classNamePieces.slice(0, -1).join('-')
    : classNamePieces[0]
}

const softMatchStaticConfig = ({ className, prefix }) => {
  const props = { obj: staticStyles, prefix }
  const config = softMatchStaticClass({ ...props, className })
  const classNamePieceCheck = getClassNamePieces(className)
  return !isEmpty(config)
    ? config
    : softMatchStaticClass({ ...props, className: classNamePieceCheck })
}

const softMatchDynamicConfig = ({ className, configTheme, prefix }) => {
  const props = { obj: dynamicStyles, configTheme, prefix }
  const config = softMatchDynamicClass({ ...props, className })
  const classNamePieceCheck = getClassNamePieces(className)
  return !isEmpty(config)
    ? config
    : softMatchDynamicClass({
        ...props,
        className: classNamePieceCheck
      })
}

const softMatchConfigs = ({ className, configTheme, prefix }) => {
  // Get soft matches from the static and dynamic configs for suggestions
  const configStatic = softMatchStaticConfig({ className, prefix })
  const configDynamic = softMatchDynamicConfig({
    className,
    configTheme,
    prefix
  })
  return {
    ...configDynamic,
    ...configStatic
  }
}

const softMatchDynamicClass = ({ className, obj, configTheme, prefix }) => {
  if (typeof obj !== 'object') return []
  const values = Object.entries(obj).map(([key, value]) => {
    if (!value.config) return []
    const config = dlv(configTheme, value.config)
    return Object.entries(config).map(([k, v]) => {
      const hasObjectValue = typeof v === 'object'
      const hasDefaultKey = k === 'default'
      const hasNegative = k.slice(0, 1) === '-'
      return {
        [`${hasNegative ? '-' : ''}${key}${
          hasDefaultKey ? '' : `${hasNegative ? '' : '-'}${k}`
        }${hasObjectValue ? chalk.hex('#999')('-xxx') : ''}`]: hasObjectValue
          ? ''
          : v
      }
    })
  })
  const combinedValues = [].concat(...values)
  const matches = combinedValues
    .filter(item => Object.keys(item)[0].startsWith(`${prefix}${className}`))
    .reduce(
      (acc, item) => ({
        ...acc,
        ...item
      }),
      {}
    )
  return matches
}

const softMatchStaticClass = ({ className, obj, prefix }) => {
  if (typeof obj !== 'object') return {}
  const matches = Object.entries(obj)
    .filter(
      ([key, value]) =>
        !isEmpty(value) && key.startsWith(`${prefix}${className}`)
    )
    .reduce(
      (acc, item) => ({
        ...acc,
        [item[0]]: ''
      }),
      {}
    )
  return matches
}

const logInOut = (input, output) =>
  `${chalk.greenBright('✓')} ${input} ${chalk.greenBright(
    JSON.stringify(output)
  )}`

const logNoVariant = (variant, validModifiers) =>
  spaced(
    `${warning(
      `The variant “${variant}:” is unavailable.`
    )}\n\nTry one of these variants:\n${validModifiers
      .map(
        (item, index) =>
          `${
            validModifiers.length > 6 && index % 6 === 0 && index > 0
              ? '\n'
              : ''
          }${chalk.yellowBright(item)}:`
      )
      .join(chalk.gray(' / '))}`
  )

const suggestions = ({ config }) => {
  if (!config) return ''
  if (Object.keys(config).length === 0) return ''
  const configLength = Object.entries(config).length
  // Single suggestion
  if (configLength === 1)
    return `\n\nDid you mean ${chalk.yellowBright(Object.keys(config).join())}?`
  // Multiple suggestions
  let lineLength = 0
  return `\n\nTry one of these classes:\n${Object.entries(config)
    .map(([key, value], index) => {
      const displayValue = value ? ` ${chalk.hex('#999')(`[${value}]`)}` : ''
      const result = `${key !== 'undefined' ? key : ''}${displayValue}`
      lineLength = lineLength + `${result}${value}`.length
      const divider =
        lineLength > 150
          ? '\n'
          : index !== Object.entries(config).length - 1
          ? chalk.gray(` / `)
          : ''
      if (lineLength > 150) lineLength = 0
      return `${chalk.yellowBright(result)}${divider}`
    })
    .join('')}`
}

const logNoClass = ({ className, config }) =>
  spaced(
    `${warning(
      `${
        className ? chalk.yellowBright(className) : 'Class'
      } was not found in the Tailwind config.`
    )}${suggestions({ config })}`
  )

const logNoTrailingDash = className =>
  spaced(warning(`Class “${className}” shouldn’t have a trailing dash.`))

export {
  logInOut,
  logNoVariant,
  logNoClass,
  logNoTrailingDash,
  softMatchConfigs
}
