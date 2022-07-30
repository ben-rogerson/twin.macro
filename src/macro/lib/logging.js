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
  return good
    ? spaced(
        `${color.error('✕ Bad:')} ${
          typeof bad === 'function' ? bad(color) : bad
        }\n${color.success('✓ Good:')} ${
          typeof good === 'function' ? good(color) : good
        }${extra ? `\n\n${extra}` : ''}`
      )
    : logGeneralError(bad)
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

function logErrorFix(error, good) {
  return spaced(`${color.error(error)}\n${color.success('Fix:')} ${good}`)
}

function jsxElementNameError() {
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
