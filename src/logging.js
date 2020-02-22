import chalk from 'chalk'

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
            validModifiers.length > 8 &&
            Math.ceil(validModifiers.length / 2) === index
              ? '\n'
              : ''
          }${item}:`
      )
      .join(`${chalk.gray(' / ')}`)}`
  )

const logNoClass = className =>
  spaced(
    warning(
      `${
        className ? `“${className}”` : 'Class'
      } was not found in the Tailwind config.`
    )
  )

const logNoTrailingDash = className =>
  spaced(warning(`Class “${className}” shouldn't have a trailing dash.`))

export { logInOut, logNoVariant, logNoClass, logNoTrailingDash }
