import chalk from 'chalk'
import type {
  MakeColor,
  ColorType,
  ColorValue,
  TwinConfigAll,
} from 'core/types'

const colors = {
  error: chalk.hex('#ff8383'),
  errorLight: chalk.hex('#ffd3d3'),
  warn: chalk.yellowBright,
  success: chalk.greenBright,
  highlight: chalk.yellowBright,
  subdued: chalk.hex('#999'),
}

function makeColor(hasColor: boolean): MakeColor {
  return (message: string, type: keyof typeof colors = 'error') => {
    if (!hasColor) return message
    return colors[type](message)
  }
}

function spaced(string: string): string {
  return `\n\n${string}\n`
}

function warning(string: string): string {
  return colors.error(`✕ ${string}`)
}

function logGeneralError(error: string | [ColorValue, string]): string {
  return Array.isArray(error)
    ? spaced(
        `${warning(
          typeof error[0] === 'function' ? error[0](colors) : error[0]
        )}\n\n${error[1]}`
      )
    : spaced(warning(error))
}

function createDebug(isDev: boolean, twinConfig: TwinConfigAll) {
  return (
    reference: string,
    data: unknown,
    type: ColorType = 'subdued'
  ): void => {
    if (!isDev) return
    if (!twinConfig.debug) return

    const log = `${String(colors[type]('-'))} ${reference} ${String(
      colors[type](JSON.stringify(data))
    )}`

    // eslint-disable-next-line no-console
    console.log(log)
  }
}

export { makeColor, spaced, warning, colors, logGeneralError, createDebug }
