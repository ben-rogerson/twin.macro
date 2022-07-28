import chalk from 'chalk'

const color = {
  error: chalk.hex('#ff8383'),
  errorLight: chalk.hex('#ffd3d3'),
  warn: chalk.yellowBright,
  success: chalk.greenBright,
  highlight: chalk.yellowBright,
  highlight2: chalk.blue,
  subdued: chalk.hex('#999'),
  hex: hex => chalk.hex(hex),
}

const spaced = string => `\n\n${string}\n`
const warning = string => color.error(`✕ ${string}`)

const logBadGood = (bad, good, extra) =>
  spaced(
    `${color.error('✕ Bad:')} ${
      typeof bad === 'function' ? bad(color) : bad
    }\n${color.success('✓ Good:')} ${
      typeof good === 'function' ? good(color) : good
    }${extra ? `\n\n${extra}` : ''}`
  )

const logGeneralError = error =>
  Array.isArray(error)
    ? spaced(
        `${warning(
          typeof error[0] === 'function' ? error[0](color) : error[0]
        )}\n\n${error[1]}`
      )
    : spaced(warning(error))

export { spaced, warning, color, logBadGood, logGeneralError }
