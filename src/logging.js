import chalk from 'chalk'
import getSuggestions from './suggestions'
import { throwIf } from './utils'

const color = {
  error: chalk.hex('#ff8383'),
  errorLight: chalk.hex('#ffd3d3'),
  success: chalk.greenBright,
  highlight: chalk.yellowBright,
  highlight2: chalk.blue,
  subdued: chalk.hex('#999'),
}

const spaced = string => `\n\n${string}\n`
const warning = string => color.error(`✕ ${string}`)

const inOutPlugins = (input, output) =>
  `${color.highlight2('→')} ${input} ${color.highlight2(
    JSON.stringify(output)
  )}`

const inOut = (input, output) =>
  `${color.success('✓')} ${input} ${color.success(JSON.stringify(output))}`

const logNoVariant = (variant, validVariants) =>
  spaced(
    `${warning(`The variant “${variant}:” was not found`)}\n\n${Object.entries(
      validVariants
    )
      .map(
        ([k, v]) =>
          `${k}\n${v
            .map(
              (item, index) =>
                `${
                  v.length > 6 && index % 6 === 0 && index > 0 ? '\n' : ''
                }${color.highlight(item)}:`
            )
            .join(color.subdued(' / '))}`
      )
      .join('\n\n')}\n\nRead more at https://twinredirect.page.link/variantList`
  )

const logNotAllowed = ({ className, error }) =>
  spaced(warning(`${color.errorLight(`${className}`)} ${error}`))

const logBadGood = (bad, good) =>
  spaced(`${color.error('✕ Bad:')} ${bad}\n${color.success('✓ Good:')} ${good}`)

const logErrorFix = (error, good) =>
  `${color.error(error)}\n${color.success('Fix:')} ${good}`

const logGeneralError = error => spaced(warning(error))

const debug = (className, log) => console.log(inOut(className, log))

const formatPluginKey = key => key.replace(/(\\|(}}))/g, '').replace(/{{/g, '.')

const debugPlugins = processedPlugins => {
  console.log(
    Object.entries(processedPlugins)
      .map(([, group]) =>
        Object.entries(group)
          .map(([className, styles]) =>
            inOutPlugins(formatPluginKey(className), styles)
          )
          .join('\n')
      )
      .join(`\n`)
  )
}

const formatSuggestions = (suggestions, lineLength = 0, maxLineLength = 60) =>
  suggestions
    .map((s, index) => {
      lineLength = lineLength + `${s.target}${s.value}`.length
      const divider =
        lineLength > maxLineLength
          ? '\n'
          : index !== suggestions.length - 1
          ? color.subdued(' / ')
          : ''
      if (lineLength > maxLineLength) lineLength = 0
      return `${color.highlight(s.target)}${
        s.value ? color.subdued(` [${s.value}]`) : ''
      }${divider}`
    })
    .join('')

const logNoClass = properties => {
  const {
    pieces: { classNameRawNoVariants },
  } = properties

  const text = warning(
    `${
      classNameRawNoVariants
        ? color.errorLight(classNameRawNoVariants)
        : 'Class'
    } was not found`
  )

  return text
}

const logDeeplyNestedClass = properties => {
  const {
    pieces: { classNameRawNoVariants },
  } = properties

  const text = warning(
    `${
      classNameRawNoVariants
        ? color.errorLight(classNameRawNoVariants)
        : 'Class'
    } is too deeply nested in your tailwind.config.js`
  )

  return text
}

const checkDarkLightClasses = className =>
  throwIf(
    ['dark', 'light'].includes(className),
    () =>
      `\n\n"${className}" must be added as className:${logBadGood(
        `tw\`${className}\``,
        `<div className="${className}">`
      )}\nRead more at https://twinredirect.page.link/darkLightMode\n`
  )

const errorSuggestions = properties => {
  const {
    state: {
      configTwin: { hasSuggestions },
    },
    pieces: { className },
    isCsOnly,
  } = properties

  if (isCsOnly)
    return spaced(
      `${color.highlight(
        className
      )} isn’t in the right syntax for use in the cs prop\n\nTry something like maxWidth[100vw]\nRead more at https://twinredirect.page.link/cs-classes`
    )

  checkDarkLightClasses(className)

  const textNotFound = logNoClass(properties)
  if (!hasSuggestions) return spaced(textNotFound)

  const suggestions = getSuggestions(properties)
  if (suggestions.length === 0) return spaced(textNotFound)

  if (typeof suggestions === 'string') {
    if (suggestions === className) {
      return spaced(logDeeplyNestedClass(properties))
    }

    // Provide a suggestion for the default key update
    if (suggestions.endsWith('-default')) {
      return spaced(
        `${textNotFound}\n\n${color.highlight(
          `To fix this, rename the 'default' key to 'DEFAULT' in your tailwind config or use the class '${className}-default'`
        )}\nRead more at https://twinredirect.page.link/default-to-DEFAULT`
      )
    }

    return spaced(
      `${textNotFound}\n\nDid you mean ${color.highlight(suggestions)}?`
    )
  }

  const suggestionText =
    suggestions.length === 1
      ? `Did you mean ${color.highlight(suggestions.shift().target)}?`
      : `Try one of these classes:\n${formatSuggestions(suggestions)}`

  return spaced(`${textNotFound}\n\n${suggestionText}`)
}

const themeErrorNotFound = ({ theme, input, trimInput }) => {
  if (typeof theme === 'string') {
    return logBadGood(input, trimInput)
  }

  const textNotFound = warning(
    `${color.errorLight(input)} was not found in your theme`
  )

  if (!theme) {
    return spaced(textNotFound)
  }

  const suggestionText = `Try one of these values:\n${formatSuggestions(
    Object.entries(theme).map(([k, v]) => ({
      target: k.includes && k.includes('.') ? `[${k}]` : k,
      value: typeof v === 'string' ? v : '...',
    }))
  )}`

  return spaced(`${textNotFound}\n\n${suggestionText}`)
}

const logNotFoundVariant = ({ classNameRaw }) =>
  logBadGood(
    `${classNameRaw}`,
    [`${classNameRaw}flex`, `${classNameRaw}(flex bg-black)`].join(
      color.subdued(' / ')
    )
  )

const logNotFoundClass = logGeneralError('That class was not found')

const logStylePropertyError = spaced(
  logErrorFix(
    'Styles shouldn’t be added within a `style={...}` prop',
    'Use the tw or css prop instead: <div tw="" /> or <div css={tw``} />\n\nDisable this error by adding this in your twin config: `{ "allowStyleProp": true }`\nRead more at https://twinredirect.page.link/style-prop'
  )
)

export {
  logNoVariant,
  logNoClass,
  logNotAllowed,
  logBadGood,
  logGeneralError,
  debug,
  debugPlugins,
  inOutPlugins,
  errorSuggestions,
  themeErrorNotFound,
  logNotFoundVariant,
  logNotFoundClass,
  logStylePropertyError,
}
