import dlv from 'dlv'
import chalk from 'chalk'
import { staticStyles, dynamicStyles } from './config'

// Function duplicated in utils to resolve circular dependency
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)

const spaced = string => `\n\n${string}\n`
const warning = string => chalk.bgBlack(chalk.hex('#ff8383')(`✕ ${string}`))

const getClassNamePieces = className => {
  const classNamePieces = className.split('-')
  return classNamePieces.length > 1
    ? classNamePieces.slice(0, -1).join('-')
    : classNamePieces[0]
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

const softMatchStaticConfig = ({ className, prefix }) => {
  const props = { obj: staticStyles, prefix }
  const config = softMatchStaticClass({ ...props, className })
  const classNamePieceCheck = getClassNamePieces(className)
  return !isEmpty(config)
    ? config
    : softMatchStaticClass({ ...props, className: classNamePieceCheck })
}

// Get soft matches from the static and dynamic configs for suggestions
const softMatchConfigs = props => ({
  ...softMatchDynamicConfig(props),
  ...softMatchStaticConfig(props)
})

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
      lineLength = lineLength + `${key}${value}`.length
      const divider =
        lineLength > 60
          ? '\n'
          : index !== Object.entries(config).length - 1
          ? chalk.gray(` / `)
          : ''
      if (lineLength > 60) lineLength = 0
      return `${chalk.yellowBright(result)}${divider}`
    })
    .join('')}`
}

const logNoClass = ({ className, config, hasSuggestions }) =>
  spaced(
    `${warning(
      `${className ? chalk.hex('#ffd3d3')(className) : 'Class'} was not found`
    )}${hasSuggestions ? suggestions({ config }) : ''}`
  )

const logNoTrailingDash = className =>
  spaced(warning(`Class “${className}” shouldn’t have a trailing dash.`))

const logBadGood = (bad, good) =>
  `${chalk.hex('#ff8383')('✕ Bad:')} ${bad}\n${chalk.greenBright(
    '✓ Good:'
  )} ${good}`

export {
  logInOut,
  logNoVariant,
  logNoClass,
  logNoTrailingDash,
  logBadGood,
  softMatchConfigs
}
