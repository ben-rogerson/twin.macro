import chalk from 'chalk'

export type ColorValue = string | ((c: typeof color) => string)

const color = {
  error: chalk.red,
  errorLight: chalk.redBright,
  warn: chalk.yellowBright,
  success: chalk.greenBright,
  highlight: chalk.yellowBright,
  subdued: chalk.hex('#999'),
  hex: (hex: string): chalk.Chalk => chalk.hex(hex),
}

function spaced(string: string): string {
  return `\n\n${string}\n`
}

function warning(string: string): string {
  return color.error(`✕ ${string}`)
}

function logBadGood(
  bad: ColorValue | string,
  good: ColorValue,
  extra?: string
): string {
  return good
    ? spaced(
        `${color.error('✕ Bad:')} ${
          typeof bad === 'function' ? bad(color) : bad
        }\n${color.success('✓ Good:')} ${
          typeof good === 'function' ? good(color) : good
        }${extra ? `\n\n${extra}` : ''}`
      )
    : logGeneralError(bad as string)
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

function logErrorFix(error: string, good: string): string {
  return spaced(`${color.error(error)}\n${color.success('Fix:')} ${good}`)
}

function jsxElementNameError(): string {
  return logGeneralError(
    `The css prop + tw props can only be added to jsx elements with a single dot in their name (or no dot at all).`
  )
}

const logStylePropertyError = logErrorFix(
  'Styles shouldn’t be added within a `style={...}` prop',
  'Use the tw or css prop instead: <div tw="" /> or <div css={tw``} />\n\nDisable this error by adding this in your twin config: `{ "allowStyleProp": true }`\nRead more at https://twinredirect.page.link/style-prop'
)

export {
  spaced,
  warning,
  color,
  logBadGood,
  logGeneralError,
  jsxElementNameError,
  logStylePropertyError,
}
