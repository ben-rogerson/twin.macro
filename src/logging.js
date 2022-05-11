import stringSimilarity from 'string-similarity'
import chalk from 'chalk'
import { formatProp } from './macro/debug'
import { corePlugins } from './config'
import {
  getTheme,
  stripNegative,
  isEmpty,
  throwIf,
  toArray,
  isObject,
  splitOnFirst,
} from './utils'

const color = {
  error: chalk.hex('#ff8383'),
  errorLight: chalk.hex('#ffd3d3'),
  success: chalk.greenBright,
  highlight: chalk.yellowBright,
  highlight2: chalk.blue,
  subdued: chalk.hex('#999'),
  hex: hex => chalk.hex(hex),
}

const spaced = string => `\n\n${string}\n`
const warning = string => color.error(`✕ ${string}`)

const inOutPlugins = (input, output, layer) =>
  `${layer} ${color.highlight2('→')} ${input} ${color.highlight2(
    JSON.stringify(output)
  )}`

const inOut = (input, output) =>
  `${color.success('✓')} ${input} ${color.success(JSON.stringify(output))}`

const logNoVariant = (variant, validVariants) =>
  spaced(
    `${warning(
      `The variant ${color.errorLight(`${variant}:`)} was not found`
    )}\n\n${Object.entries(validVariants)
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

const logNotAllowed = (className, error, fix) =>
  spaced(
    [
      warning(`${color.errorLight(className)} ${error}`),
      fix ? (typeof fix === 'function' ? fix(color) : fix) : '',
    ]
      .filter(Boolean)
      .join('\n\n')
  )

const logBadGood = (bad, good) =>
  good
    ? spaced(
        `${color.error('✕ Bad:')} ${
          typeof bad === 'function' ? bad(color) : bad
        }\n${color.success('✓ Good:')} ${
          typeof good === 'function' ? good(color) : good
        }`
      )
    : logGeneralError(bad)

const logErrorFix = (error, good) =>
  spaced(`${color.error(error)}\n${color.success('Fix:')} ${good}`)

const logGeneralError = error => spaced(warning(error))

const debugSuccess = (className, log) => inOut(formatProp(className), log)

const formatPluginKey = key => key.replace(/(\\|(}}))/g, '').replace(/{{/g, '.')

const debugPlugins = processedPlugins => {
  console.log(
    Object.entries(processedPlugins)
      .map(([layer, group]) =>
        Object.entries(group)
          .map(([className, styles]) =>
            inOutPlugins(formatPluginKey(className), styles, layer)
          )
          .join('\n')
      )
      .join(`\n`)
  )
}

const formatSuggestions = suggestions =>
  suggestions
    .map(
      s =>
        `${color.subdued('-')} ${color.highlight(s.target)}${
          s.value
            ? ` ${color.subdued('>')} ${
                isHex(s.value) ? color.hex(s.value)(`▣ `) : ''
              }${s.value}`
            : ''
        }`
    )
    .join('\n')

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

const isHex = hex => /^#([\da-f]{3}){1,2}$/i.test(hex)

const errorSuggestions = properties => {
  const {
    state: {
      configTwin: { hasSuggestions },
      config: { prefix },
    },
    pieces: { className },
    isCsOnly,
  } = properties

  if (isCsOnly)
    return spaced(
      `${color.highlight(
        className
      )} isn’t valid “short css”.\n\nThe syntax is like this: max-width[100vw]\nRead more at https://twinredirect.page.link/cs-classes`
    )

  checkDarkLightClasses(className)

  const textNotFound = logNoClass(properties)
  if (!hasSuggestions) return spaced(textNotFound)

  const suggestions = getSuggestions(properties)
  if (suggestions.length === 0) return spaced(textNotFound)

  if (typeof suggestions === 'string') {
    if (suggestions === className)
      return spaced(logDeeplyNestedClass(properties))

    // Provide a suggestion for the default key update
    if (suggestions.endsWith('-default'))
      return spaced(
        `${textNotFound}\n\n${color.highlight(
          `To fix this, rename the 'default' key to 'DEFAULT' in your tailwind config or use the class '${className}-default'`
        )}\nRead more at https://twinredirect.page.link/default-to-DEFAULT`
      )

    return spaced(
      `${textNotFound}\n\nDid you mean ${color.highlight(
        [prefix, suggestions].filter(Boolean).join('')
      )}?`
    )
  }

  const suggestion = [...suggestions].shift()

  const suggestionText =
    suggestions.length === 1
      ? `Did you mean ${color.highlight(
          [prefix, suggestion.target].filter(Boolean).join('')
        )}?`
      : `Try one of these classes:\n\n${formatSuggestions(suggestions)}`

  return spaced(`${textNotFound}\n\n${suggestionText}`)
}

const themeErrorNotFound = ({ theme, input, trimInput }) => {
  if (typeof theme === 'string') return logBadGood(input, trimInput)

  const textNotFound = warning(
    `${color.errorLight(input)} was not found in your theme`
  )

  if (!theme) return spaced(textNotFound)

  const suggestionText = `Try one of these values:\n${formatSuggestions(
    Object.entries(theme).map(([k, v]) => ({
      target: k.includes && k.includes('.') ? `[${k}]` : k,
      value: typeof v === 'string' ? v : '...',
    }))
  )}`

  return spaced(`${textNotFound}\n\n${suggestionText}`)
}

const opacityErrorNotFound = ({ className }) =>
  logBadGood(
    `The class \`${className}\` had an unsupported slash opacity`,
    `Remove the opacity from the end of the class`
  )

const logNotFoundVariant = ({ classNameRaw }) =>
  logBadGood(
    `${classNameRaw}`,
    [`${classNameRaw}flex`, `${classNameRaw}(flex bg-black)`].join(
      color.subdued(' / ')
    )
  )

const logNotFoundClass = logGeneralError('That class was not found')

const logStylePropertyError = logErrorFix(
  'Styles shouldn’t be added within a `style={...}` prop',
  'Use the tw or css prop instead: <div tw="" /> or <div css={tw``} />\n\nDisable this error by adding this in your twin config: `{ "allowStyleProp": true }`\nRead more at https://twinredirect.page.link/style-prop'
)

const debug = state => message => {
  if (state.isDev !== true) return
  if (state.configTwin.debug !== true) return

  return console.log(message)
}

const getCustomSuggestions = className => {
  const suggestions = {
    'flex-center': 'items-center / justify-center',
    'display-none': 'hidden',
    'display-inline': 'inline-block',
    'display-flex': 'flex',
    'border-radius': 'rounded',
    'flex-column': 'flex-col',
    'flex-column-reverse': 'flex-col-reverse',
    'text-italic': 'italic',
    'text-normal': 'font-normal / not-italic',
    ellipsis: 'text-ellipsis',
    'flex-no-wrap': 'flex-nowrap',
  }[className]
  if (suggestions) return suggestions
}

const flattenObject = (object, prefix = '') => {
  if (!object) return {}

  return Object.keys(object).reduce((result, k) => {
    const pre = prefix.length > 0 ? prefix + '-' : ''

    const value = object[k]
    const fullKey = pre + k

    if (Array.isArray(value)) {
      result[fullKey] = value
    } else if (typeof value === 'object') {
      Object.assign(result, flattenObject(value, fullKey))
    } else {
      result[fullKey] = value
    }

    return result
  }, {})
}

const targetTransforms = [
  ({ target }) => (target === 'DEFAULT' ? '' : target),
  ({ corePluginName, target }) => {
    const prefix = target !== stripNegative(target) ? '-' : ''
    return `${prefix}${[corePluginName, stripNegative(target)]
      .filter(Boolean)
      .join('-')}`
  },
]

const filterKeys = (object, negativesOnly) =>
  Object.entries(object).reduce(
    (result, [k, v]) => ({
      ...result,
      ...((negativesOnly ? k.startsWith('-') : !k.startsWith('-')) && {
        [k.replace('-DEFAULT', '')]: v,
      }),
    }),
    {}
  )

const normalizeCoreConfig = ({
  config,
  input,
  corePluginName,
  hasNegative,
}) => {
  const results = Object.entries(
    filterKeys(flattenObject(config), hasNegative)
  ).map(([target, value]) => ({
    ...(input && {
      rating: Number(
        stringSimilarity.compareTwoStrings(
          [corePluginName, target].join('-'),
          input
        )
      ),
    }),
    target: targetTransforms.reduce(
      (result, transformer) => transformer({ corePluginName, target: result }),
      target
    ),
    value: typeof value === 'function' ? '' : String(value), // Make sure objects are flattened and viewable
  }))

  const filteredResults = results.filter(
    item =>
      !item.target.includes('-array-') &&
      (input.rating ? typeof item.rating !== 'undefined' : true)
  )

  return filteredResults
}

const matchConfig = ({
  config,
  theme,
  className,
  corePluginName,
  hasNegative,
}) =>
  [...config]
    .reduce(
      (results, item) =>
        // eslint-disable-next-line unicorn/prefer-spread
        results.concat(
          normalizeCoreConfig({
            config: theme(item),
            input: className,
            corePluginName,
            hasNegative,
          })
        ),
      []
    )
    .sort((a, b) => b.rating - a.rating)

const getConfig = properties =>
  matchConfig({ ...properties, className: null }).slice(0, 20)

const sortRatingHighestFirst = (a, b) => b.rating - a.rating

const getSuggestions = args => {
  const {
    pieces: { className, hasNegative },
    state,
    config,
    corePluginName,
  } = args
  const customSuggestions = getCustomSuggestions(className)
  if (customSuggestions) return customSuggestions

  if (!isEmpty(config)) {
    const theme = getTheme(state.config.theme)
    const properties = { config, theme, corePluginName, className, hasNegative }
    const matches = matchConfig(properties)
    if (matches.length === 0) return getConfig(properties)

    // Check if the user means to select a default class
    const defaultFound = matches.find(
      match =>
        match.target.endsWith('-default') &&
        match.target.replace('-default', '') === className
    )
    if (defaultFound) return [defaultFound]

    // If there's high rated suggestions then return them
    const trumpMatches = matches.filter(match => match.rating >= 0.5)
    if (!isEmpty(trumpMatches)) return trumpMatches.slice(0, 5)

    return matches.slice(0, 5)
  }

  const classMatches = [
    ...new Set(
      Object.entries(corePlugins)
        .map(([k, v]) =>
          toArray(v).map(v =>
            isObject(v.output)
              ? `${k}`
              : !isEmpty(v.config)
              ? getSuggestions({
                  ...args,
                  config: toArray(v.config),
                }).map(s => (s.target ? [k, s.target].join('-') : k))
              : `${k}-___`
          )
        )
        .filter(Boolean)
        .flat(2)
    ),
  ]

  let matches = stringSimilarity
    .findBestMatch(className, classMatches)
    .ratings.filter(item => item.rating > 0.2)
  if (matches.length === 0) return []

  // Bump up the rating on matches where the first few letters match
  const [firstPart] = splitOnFirst(className, '-')
  matches = matches.map(m => ({
    ...m,
    rating:
      Number(m.rating) +
      (stringSimilarity.compareTwoStrings(firstPart, m.target) > 0.2 ? 0.2 : 0),
  }))

  matches = matches.sort(sortRatingHighestFirst)

  // Single trumping match - good chance this is the one
  const trumpMatch = matches.find(match => match.rating >= 0.6)
  if (trumpMatch) return trumpMatch.target

  return matches.slice(0, 5)
}

const getUnsupportedError = feature =>
  logErrorFix(
    `A plugin is trying to use the unsupported “${feature}” function`,
    `Either remove the plugin or add this in your twin config: \`{ "allowUnsupportedPlugins": true }\``
  )

export {
  logNoVariant,
  logNotAllowed,
  logBadGood,
  logGeneralError,
  logNotFoundVariant,
  logNotFoundClass,
  logStylePropertyError,
  debug,
  debugSuccess,
  debugPlugins,
  errorSuggestions,
  opacityErrorNotFound,
  themeErrorNotFound,
  getUnsupportedError,
}
