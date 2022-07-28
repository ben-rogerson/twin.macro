// import { logBadGood } from './lib/logging'

const getSuggestions = (className, params) => {
  const ThrowError = params.CustomError || Error

  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw new ThrowError(
    `\n\n${className} not found\n\nInfo: version number + help links`
  )
  // params.assert(
  //   !['group', 'peer'].includes(className), // << need unwrapped classname here
  //   // false,
  //   `\`${className}\` must be added as className${logBadGood(
  //     // eslint-disable-next-line no-useless-escape
  //     `tw\`${className}\` / <div tw\="${className}" />`,
  //     `<div className="${className}" />`,
  //     `Read more at https://twinredirect.page.link/${className}`
  //   )}`
  // )
}

export default getSuggestions

// import stringSimilarity from 'string-similarity'
// import throwIf from './util/throwIf'
// import isEmpty from './util/isEmpty'
// import toArray from './util/toArray'
// import isObject from './util/isObject'
// import splitOnFirst from './util/splitOnFirst'

//   const checkDarkLightClasses = className =>
//   throwIf(
//     ['dark', 'light'].includes(className),
//     () =>
//       `\n\n"${className}" must be added as className:${logBadGood(
//         `tw\`${className}\``,
//         `<div className="${className}">`
//       )}\nRead more at https://twinredirect.page.link/darkLightMode\n`
//   )

// const checkTypographyClasses = (className, config) =>
//   throwIf(
//     className === 'lead' && config.plugins.length > 0,
//     () =>
//       `\n\n"${className}" (from the official typography plugin) must be added as className:${logBadGood(
//         `tw\`${className}\``,
//         `<div className="${className}">`
//       )}`
//   )

// const logAlphaError = alphaError => {
//   const [errorText, errorResolve, errorConfig] = alphaError
//   return logErrorFix(
//     errorText,
//     `${errorResolve}\n\n${Object.entries(errorConfig)
//       .map(
//         ([k, v]) =>
//           `${color.subdued('-')} ${color.highlight(k)} ${color.subdued(
//             '>'
//           )} ${v}`
//       )
//       .join('\n')}`
//   )
// }

// const logInvalidShortCssError = className =>
//   spaced(
//     `${color.highlight(
//       className
//     )} isn’t valid “short css”.\n\nThe syntax is like this: max-width[100vw]\nRead more at https://twinredirect.page.link/cs-classes`
//   )

// const errorSuggestions = (className, properties) => {
//   const {
//     state: {
//       tailwindConfig,
//       configTwin: { hasSuggestions },
//     },
//     pieces: { alphaError },
//     isCsOnly,
//   } = properties

//   if (isCsOnly) return logInvalidShortCssError(className)

//   if (alphaError) return logAlphaError(alphaError)

//   checkDarkLightClasses(className)
//   checkTypographyClasses(className, tailwindConfig)

//   const textNotFound = warning(
//     `${color.errorLight(className)} was not found\n\n${JSON.stringify(
//       tailwindConfig
//     )}`
//   )

//   if (!hasSuggestions) return spaced(textNotFound)

//   return spaced(textNotFound)

// const suggestions = getSuggestions(properties)
// if (suggestions.length === 0) return spaced(textNotFound)

// if (typeof suggestions === 'string') {
//   if (suggestions === className)
//     return spaced(logDeeplyNestedClass(properties))

//   // Provide a suggestion for the default key update
//   if (suggestions.endsWith('-default'))
//     return spaced(
//       `${textNotFound}\n\n${color.highlight(
//         `To fix this, rename the 'default' key to 'DEFAULT' in your tailwind config or use the class '${className}-default'`
//       )}\nRead more at https://twinredirect.page.link/default-to-DEFAULT`
//     )

//   return spaced(
//     `${textNotFound}\n\nDid you mean ${color.highlight(
//       [prefix, suggestions].filter(Boolean).join('')
//     )}?`
//   )
// }

// const suggestion = [...suggestions].shift()

// const suggestionText =
//   suggestions.length === 1
//     ? `Did you mean ${color.highlight(
//         [prefix, suggestion.target].filter(Boolean).join('')
//       )}?`
//     : `Try one of these classes:\n\n${formatSuggestions(suggestions)}`

// return spaced(`${textNotFound}\n\n${suggestionText}`)
// }

// const opacityErrorNotFound = ({ className }) =>
//   logBadGood(
//     `The class “${className}” shouldn’t have a slash opacity`,
//     `Remove the slash opacity or add the class to your config, eg: \`{ "${className}": "value" }\``
//   )

// const logNotFoundVariant = ({ classNameRaw }) =>
//   logBadGood(
//     `${classNameRaw}`,
//     [`${classNameRaw}flex`, `${classNameRaw}(flex bg-black)`].join(
//       color.subdued(' / ')
//     )
//   )

// const logNotFoundClass = logGeneralError('That class was not found')

// ===========================

// const stripNegative = string =>
//   string && string.length > 1 && string.slice(0, 1) === '-'
//     ? string.slice(1, string.length)
//     : string

// const targetTransforms = [
//   ({ target }) => (target === 'DEFAULT' ? '' : target),
//   ({ corePluginName, target }) => {
//     const prefix = target !== stripNegative(target) ? '-' : ''
//     return `${prefix}${[corePluginName, stripNegative(target)]
//       .filter(Boolean)
//       .join('-')}`
//   },
// ]

// const filterKeys = (object, negativesOnly) =>
//   Object.entries(object).reduce(
//     (result, [k, v]) => ({
//       ...result,
//       ...((negativesOnly ? k.startsWith('-') : !k.startsWith('-')) && {
//         [k.replace('-DEFAULT', '')]: v,
//       }),
//     }),
//     {}
//   )

// const getCoreConfigRatings = ({ config, input, corePluginName }) => {
//   const results = Object.entries(config).map(([target, value]) => ({
//     ...(input && {
//       rating: Number(
//         stringSimilarity.compareTwoStrings(
//           [corePluginName, target].join('-'),
//           input
//         )
//       ),
//     }),
//     target: targetTransforms.reduce(
//       (result, transformer) => transformer({ corePluginName, target: result }),
//       target
//     ),
//     value:
//       (typeof value === 'function' && '') ||
//       (Array.isArray(value) && JSON.stringify(value)) ||
//       String(value), // Make sure objects are flattened and viewable
//   }))

//   const filteredResults = results.filter(
//     item =>
//       !item.target.includes('-array-') &&
//       (input.rating ? typeof item.rating !== 'undefined' : true)
//   )

//   return filteredResults
// }

// const flattenObject = (object, prefix = '') => {
//   if (!object) return {}

//   return Object.keys(object).reduce((result, k) => {
//     const pre = prefix.length > 0 ? prefix + '-' : ''

//     const value = object[k]
//     const fullKey = pre + k

//     if (Array.isArray(value)) {
//       result[fullKey] = value
//     } else if (typeof value === 'object') {
//       Object.assign(result, flattenObject(value, fullKey))
//     } else {
//       result[fullKey] = value
//     }

//     return result
//   }, {})
// }

// const matchConfig = ({
//   config,
//   theme,
//   className,
//   corePluginName,
//   hasNegative,
// }) =>
//   [...config]
//     .reduce(
//       (results, item) =>
//         // eslint-disable-next-line unicorn/prefer-spread
//         results.concat(
//           getCoreConfigRatings({
//             config: filterKeys(flattenObject(theme(item)), hasNegative),
//             input: className,
//             corePluginName,
//           })
//         ),
//       []
//     )
//     .sort((a, b) => b.rating - a.rating)

// const getConfig = properties =>
//   matchConfig({ ...properties, className: null }).slice(0, 20)

// const sortRatingHighestFirst = (a, b) => b.rating - a.rating

// const filterCorePlugins = corePlugins =>
//   Object.entries('corePlugins').filter(
//     ([, value]) => typeof value !== 'function'
//   )

// const getSuggestions = args => {
//   const {
//     pieces: { className, hasNegative },
//     config,
//     corePluginName,
//   } = args
//   const customSuggestions = getCustomSuggestions(className)
//   if (customSuggestions) return customSuggestions

//   if (!isEmpty(config)) {
//     // const theme = getTheme(state.config.theme)
//     const theme = i => i
//     const properties = { config, theme, corePluginName, className, hasNegative }
//     const matches = matchConfig(properties)
//     if (matches.length === 0) return getConfig(properties)

//     // Check if the user means to select a default class
//     const defaultFound = matches.find(
//       match =>
//         match.target.endsWith('-default') &&
//         match.target.replace('-default', '') === className
//     )
//     if (defaultFound) return [defaultFound]

//     // If there's high rated suggestions then return them
//     const trumpMatches = matches.filter(match => match.rating >= 0.5)
//     if (!isEmpty(trumpMatches)) return trumpMatches.slice(0, 5)

//     return matches.slice(0, 5)
//   }

//   const classMatches = [
//     ...new Set(
//       filterCorePlugins(corePlugins)
//         .map(([k, v]) =>
//           toArray(v).map(v =>
//             isObject(v.output)
//               ? `${k}`
//               : !isEmpty(v.config)
//               ? getSuggestions({
//                   ...args,
//                   config: toArray(v.config),
//                 }).map(s => (s.target ? [k, s.target].join('-') : k))
//               : `${k}-___`
//           )
//         )
//         .filter(Boolean)
//         .flat(2)
//     ),
//   ]

//   let matches = stringSimilarity
//     .findBestMatch(className, classMatches)
//     .ratings.filter(item => item.rating > 0.2)
//   if (matches.length === 0) return []

//   // Bump up the rating on matches where the first few letters match
//   const [firstPart] = splitOnFirst(className, '-')
//   matches = matches.map(m => ({
//     ...m,
//     rating:
//       Number(m.rating) +
//       (stringSimilarity.compareTwoStrings(firstPart, m.target) > 0.2 ? 0.2 : 0),
//   }))

//   matches = matches.sort(sortRatingHighestFirst)

//   // Single trumping match - good chance this is the one
//   const trumpMatch = matches.find(match => match.rating >= 0.6)
//   if (trumpMatch) return trumpMatch.target

//   return matches.slice(0, 5)
// }

// ============

// const logNoVariant = (variant, { config, context }) => {
//     const screensList = Object.entries(
//       get(config, ['theme', 'screens']) || {}
//     ).map(([k, v]) => [k, [v]])
//     const variantList = [...screensList, ...context.variantMap]

//     const textNotFound = `The variant ${color.errorLight(
//       `${variant}:`
//     )} was not found`

//     const suggestions = variantList
//       .map(([variantName, styleList]) => {
//         const rating = Number(
//           stringSimilarity.compareTwoStrings(variant, variantName)
//         )
//         if (rating < 0.15) return
//         return [rating, variantName, styleList]
//       })
//       .filter(Boolean)
//       .sort(([a] = [], [b] = []) => b - a)
//       .slice(0, 5)
//       .map(([, variantName, styleList] = []) =>
//         [
//           color.subdued('-'),
//           `${color.highlight(variantName)}:`,
//           color.subdued('>'),
//           styleList.map(s => stripMergePlaceholders(s)).join(', '),
//         ].join(' ')
//       )
//       .join('\n')

//     const suggestionText =
//       suggestions.length > 0
//         ? `\n\nTry one of these variants:\n\n${suggestions}`
//         : ''

//     return spaced(`${warning(textNotFound)}${suggestionText}`)
//   }

//   const getVariants = params => {
//     if (!params.variants) return []

//     const list = params.variants
//       .map(variant => {
//         const arbitraryVariant = variant.match(/^\[(.+)]/)
//         if (arbitraryVariant) return arbitraryVariant[1]

//         let [foundVariant] = getFirstValue(
//           [...params.variantMap],
//           ([name, value]) =>
//             name === variant
//               ? typeof value[0] === 'function'
//                 ? value[0]
//                 : value.join(', ')
//               : false
//         )

//         if (typeof foundVariant === 'function') {
//           const context = {
//             className: params.className,
//             config: item => params.tailwindConfig[item] || null,
//           }
//           foundVariant = foundVariant(context)
//         }

//         if (!foundVariant) {
//           if (variant === 'only-child') {
//             throw new MacroError(
//               logGeneralError(
//                 'The "only-child:" variant was deprecated in favor of "only:"'
//               )
//             )
//           }

//           if (variant === 'not-only-child') {
//             throw new MacroError(
//               logGeneralError(
//                 'The "not-only-child:" variant was deprecated in favor of "not-only:"'
//               )
//             )
//           }

//           throw new MacroError(logNoVariant(variant, params))
//         }

//         return foundVariant
//       })
//       .filter(Boolean)

//     return list
//   }

//   const handleVariants = params => {
//     const variantsList = []
//     const variant = null
//     let classNameSingle = ''

//     while (variant !== null) {
//       // Match arbitrary variants
//       variant = params.className.match(/^([\d<>_a-z-]+):|^\[.*?]:/)

//       if (variant) {
//         classNameSingle = params.className.slice(variant[0].length)
//         variantsList.push(variant[0].slice(0, -1))
//       }
//     }

//     // Match the filtered variants
//     const variants = getVariants({
//       variants: variantsList,
//       tailwindConfig: params.tailwindConfig,
//       variantMap: params.variantMap,
//       className: classNameSingle,
//     })

//     return { classNameSingle, variants }
//   }

// =========================

// const isHex = hex => /^#([\da-f]{3}){1,2}$/i.test(hex)

// const formatSuggestions = suggestions =>
//   suggestions
//     .map(
//       s =>
//         `${color.subdued('-')} ${color.highlight(s.target)}${
//           s.value
//             ? ` ${color.subdued('>')} ${
//                 isHex(s.value) ? color.hex(s.value)(`▣ `) : ''
//               }${s.value}`
//             : ''
//         }`
//     )
//     .join('\n')

// const themeErrorNotFound = ({ theme, input, trimInput }) => {
//   if (typeof theme === 'string') return logBadGood(input, trimInput)

//   const textNotFound = warning(
//     `${color.errorLight(input)} was not found in your theme`
//   )

//   if (!theme) return spaced(textNotFound)

//   const suggestionText = `Try one of these values:\n${formatSuggestions(
//     Object.entries(theme).map(([k, v]) => ({
//       target: k.includes && k.includes('.') ? `[${k}]` : k,
//       value: typeof v === 'string' ? v : '...',
//     }))
//   )}`

//   return spaced(`${textNotFound}\n\n${suggestionText}`)
// }
