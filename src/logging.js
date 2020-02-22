import chalk from 'chalk'
import { splitNegative } from './negative'

const spaced = string => `\n\n${string}\n\n`
const warning = string => chalk.bgBlack(chalk.redBright(`✕ ${string}`))

const logInOut = (input, output) =>
  `${chalk.greenBright('✓')} ${input} ${chalk.greenBright(
    JSON.stringify(output)
  )}`

const logNoVariant = (variant, validModifiers) =>
  spaced(
    `${warning(
      `The variant “${variant}:” is unavailable.`
    )}\n\nAvailable variants:\n${validModifiers
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

const suggestions = ({ matchedKey, config }) => {
  if (!config) return ''
  const configLength = Object.entries(config).length
  return `Available ${matchedKey} classes:\n${Object.entries(config)
    .map(([key, value], index) => {
      const { className, hasNegative } = splitNegative({
        className: key
      })
      return `${
        configLength > 6 && index % 6 === 0 && index > 0 ? '\n' : ''
      }${chalk.yellowBright(
        `${hasNegative ? '-' : ''}${matchedKey}-${className}`
      )} ${chalk.hex('#999')(`[${value}]`)}`
    })
    .join(chalk.gray(' / '))}`
}

const logNoClass = ({ className, matchedKey, config }) =>
  spaced(
    `${warning(
      `${
        className ? `“${className}”` : 'Class'
      } was not found in the Tailwind config.`
    )}\n\n${suggestions({ matchedKey, config })}`
  )

const logNoTrailingDash = className =>
  spaced(warning(`Class “${className}” shouldn't have a trailing dash.`))

export { logInOut, logNoVariant, logNoClass, logNoTrailingDash }
