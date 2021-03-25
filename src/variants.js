/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { MacroError } from 'babel-plugin-macros'
import cleanSet from 'clean-set'
import { stringifyScreen } from './screens'
import { logNoVariant, logGeneralError } from './logging'
import { variantConfig } from './config'
import { get, throwIf } from './utils'
import {
  variantDarkMode,
  variantLightMode,
  prefixDarkLightModeClass,
} from './darkLightMode'
import { SPACE_ID } from './contants'

const fullVariantConfig = variantConfig({
  variantDarkMode,
  variantLightMode,
  prefixDarkLightModeClass,
})

/**
 * Validate variants against the variants config key
 */
const validateVariants = ({ variants, state, ...rest }) => {
  if (!variants) return []

  const screens = get(state.config, ['theme', 'screens'])
  const screenNames = Object.keys(screens)

  return variants
    .map(variant => {
      const isResponsive = screenNames && screenNames.includes(variant)
      if (isResponsive) {
        return stringifyScreen(state.config, variant)
      }

      if (fullVariantConfig[variant]) {
        let foundVariant = fullVariantConfig[variant]

        if (typeof foundVariant === 'function') {
          const context = {
            ...rest,
            config: item => state.config[item] || null,
            errorCustom: message => {
              throw new MacroError(logGeneralError(message))
            },
          }
          foundVariant = foundVariant(context)
        }

        if (state.configTwin.sassyPseudo) {
          return foundVariant.replace(/(?<= ):|^:/g, '&:')
        }

        return foundVariant
      }

      const validVariants = {
        ...(screenNames.length > 0 && { 'Screen breakpoints': screenNames }),
        'Built-in variants': Object.keys(fullVariantConfig),
      }
      throw new MacroError(logNoVariant(variant, validVariants))
    })
    .filter(Boolean)
}

/**
 * Split the variant(s) from the className
 */
const splitVariants = ({ classNameRaw, state }) => {
  const variantsList = []
  let variant
  let className = classNameRaw
  while (variant !== null) {
    variant = className.match(/^([\d_a-z-]+):/)
    if (variant) {
      className = className.slice(variant[0].length)
      variantsList.push(variant[1])
    }
  }

  // dark: and light: variants
  const hasDarkVariant = variantsList.some(v => v === 'dark')
  const hasLightVariant = variantsList.some(v => v === 'light')
  if (hasDarkVariant && hasLightVariant) {
    throw new MacroError(
      logGeneralError(
        'The light: and dark: variants can’t be used on the same element'
      )
    )
  }

  const hasGroupVariant = variantsList.some(v => v.startsWith('group-'))

  // Match the filtered variants
  const variants = validateVariants({
    variants: variantsList,
    state,
    hasDarkVariant,
    hasLightVariant,
    hasGroupVariant,
  })

  const hasVariants = variants.length > 0

  return {
    classNameRawNoVariants: className,
    className, // TODO: Hoist the definition for className up, it's buried here
    variants,
    hasVariants,
  }
}

const addVariants = ({ results, style, pieces }) => {
  const { variants } = pieces
  if (variants.length === 0) return

  const styleWithVariants = cleanSet(results, variants, {
    ...get(styleWithVariants, variants, {}),
    ...style,
  })

  return styleWithVariants
}

function findRightBracket(
  classes,
  start = 0,
  end = classes.length,
  brackets = ['(', ')']
) {
  let stack = 0
  for (let index = start; index < end; index++) {
    if (classes[index] === brackets[0]) {
      stack += 1
    } else if (classes[index] === brackets[1]) {
      if (stack === 0) return
      if (stack === 1) return index
      stack -= 1
    }
  }
}

// eslint-disable-next-line max-params
function spreadVariantGroups(
  classes,
  context = '',
  importantContext = false,
  start = 0,
  end
) {
  if (classes === '') return []

  const results = []
  classes = classes.slice(start, end).trim()

  const reg = /([\w-]+:)|([\w-./[\]]+!?)|\(|(\S+)/g

  let match
  const baseContext = context

  while ((match = reg.exec(classes))) {
    const [, variant, className, weird] = match

    if (variant) {
      context += variant

      // Skip empty classes
      if (/\s/.test(classes[reg.lastIndex])) {
        context = baseContext
        continue
      }

      if (classes[reg.lastIndex] === '(') {
        const closeBracket = findRightBracket(classes, reg.lastIndex)
        throwIf(typeof closeBracket !== 'number', () =>
          logGeneralError(
            `An ending bracket ')' wasn’t found for these classes:\n\n${classes}`
          )
        )

        const importantGroup = classes[closeBracket + 1] === '!'

        results.push(
          ...spreadVariantGroups(
            classes,
            context,
            importantContext || importantGroup,
            reg.lastIndex + 1,
            closeBracket
          )
        )
        reg.lastIndex = closeBracket + (importantGroup ? 2 : 1)
        context = baseContext
      }
    } else if (className && className.includes('[')) {
      const closeBracket = findRightBracket(
        classes,
        match.index,
        classes.length,
        ['[', ']']
      )
      throwIf(typeof closeBracket !== 'number', () =>
        logGeneralError(
          `An ending bracket ']' wasn’t found for these classes:\n\n${classes}`
        )
      )
      const importantGroup = classes[closeBracket + 1] === '!'
      const cssClass = classes.slice(match.index, closeBracket + 1)

      // Convert spaces in classes to a temporary string so the css won't be
      // split into multiple classes
      const spaceReplacedClass = cssClass
        // Normalise the spacing - single spaces only
        // Replace spaces with the space id stand-in
        // Remove newlines within the brackets to allow multiline values
        .replace(/\s+/g, SPACE_ID)

      results.push(
        context +
          spaceReplacedClass +
          (importantGroup || importantContext ? '!' : '')
      )

      reg.lastIndex = closeBracket + (importantGroup ? 2 : 1)
      context = baseContext
    } else if (className) {
      const tail = !className.endsWith('!') && importantContext ? '!' : ''
      results.push(context + className + tail)
      context = baseContext
    } else if (weird) {
      results.push(context + weird)
    } else {
      const closeBracket = findRightBracket(classes, match.index)
      throwIf(typeof closeBracket !== 'number', () =>
        logGeneralError(
          `An ending bracket ')' wasn’t found for these classes:\n\n${classes}`
        )
      )

      const importantGroup = classes[closeBracket + 1] === '!'
      results.push(
        ...spreadVariantGroups(
          classes,
          context,
          importantContext || importantGroup,
          match.index + 1,
          closeBracket
        )
      )
      reg.lastIndex = closeBracket + (importantGroup ? 2 : 1)
    }
  }

  return results
}

const handleVariantGroups = classes => spreadVariantGroups(classes).join(' ')

export { splitVariants, addVariants, handleVariantGroups }
