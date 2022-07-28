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
  good
    ? spaced(
        `${color.error('✕ Bad:')} ${
          typeof bad === 'function' ? bad(color) : bad
        }\n${color.success('✓ Good:')} ${
          typeof good === 'function' ? good(color) : good
        }${extra ? `\n\n${extra}` : ''}`
      )
    : logGeneralError(bad)

const logGeneralError = error =>
  Array.isArray(error)
    ? spaced(
        `${warning(
          typeof error[0] === 'function' ? error[0](color) : error[0]
        )}\n\n${error[1]}`
      )
    : spaced(warning(error))

const logErrorFix = (error, good) =>
  spaced(`${color.error(error)}\n${color.success('Fix:')} ${good}`)

const logStylePropertyError = logErrorFix(
  'Styles shouldn’t be added within a `style={...}` prop',
  'Use the tw or css prop instead: <div tw="" /> or <div css={tw``} />\n\nDisable this error by adding this in your twin config: `{ "allowStyleProp": true }`\nRead more at https://twinredirect.page.link/style-prop'
)

const createDebug =
  (isDev, configTwin) =>
  (reference, data, type = 'subdued') => {
    if (isDev !== true) return
    if (configTwin.debug !== true) return

    const log = `${color[type]('-')} ${reference} ${color[type](
      JSON.stringify(data)
    )}`

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return console.log(log)
  }

export {
  spaced,
  warning,
  color,
  logBadGood,
  logGeneralError,
  logStylePropertyError,
  createDebug,
}
