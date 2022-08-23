import chalk from 'chalk'
// eslint-disable-next-line import/no-relative-parent-imports
import type { ColorType, ColorValue, TwinConfigAll } from '../types'

const color = {
  error: chalk.hex('#ff8383'),
  errorLight: chalk.hex('#ffd3d3'),
  warn: chalk.yellowBright,
  success: chalk.greenBright,
  highlight: chalk.yellowBright,
  subdued: chalk.hex('#999'),
}

function spaced(string: string): string {
  return `\n\n${string}\n`
}

function warning(string: string): string {
  return color.error(`✕ ${string}`)
}

function logGeneralError(error: string | [ColorValue, string]): string {
  return Array.isArray(error)
    ? spaced(
        `${warning(
          typeof error[0] === 'function' ? error[0](color) : error[0]
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

    const log = `${String(color[type]('-'))} ${reference} ${String(
      color[type](JSON.stringify(data))
    )}`

    // eslint-disable-next-line no-console
    console.log(log)
  }
}

export { spaced, warning, color, logGeneralError, createDebug }
