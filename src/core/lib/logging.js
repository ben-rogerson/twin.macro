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

function spaced(string) {
  return `\n\n${string}\n`
}

function warning(string) {
  return color.error(`✕ ${string}`)
}

function logBadGood(bad, good, extra) {
  return spaced(
    `${color.error('✕ Bad:')} ${
      typeof bad === 'function' ? bad(color) : bad
    }\n${color.success('✓ Good:')} ${
      typeof good === 'function' ? good(color) : good
    }${extra ? `\n\n${extra}` : ''}`
  )
}

function logGeneralError(error) {
  return Array.isArray(error)
    ? spaced(
        `${warning(
          typeof error[0] === 'function' ? error[0](color) : error[0]
        )}\n\n${error[1]}`
      )
    : spaced(warning(error))
}

function createDebug(isDev, twinConfig) {
  return (reference, data, type = 'subdued') => {
    if (isDev !== true) return
    if (twinConfig.debug !== true) return

    const log = `${color[type]('-')} ${reference} ${color[type](
      JSON.stringify(data)
    )}`

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return console.log(log)
  }
}

export { spaced, warning, color, logBadGood, logGeneralError, createDebug }
