import { MacroError } from 'babel-plugin-macros'
import dlv from 'dlv'
import cleanSet from 'clean-set'
import { stringifyScreen } from './screens'
import { logNoVariant, logGeneralError } from './logging'
import { variantConfig } from './config'

/**
 * Validate variants against the variants config key
 */
const validateVariants = ({ variants, state, ...rest }) => {
  if (!variants) return []

  const screens = dlv(state.config, ['theme', 'screens'])
  const screenNames = Object.keys(screens)

  return variants
    .map(variant => {
      const isResponsive = screenNames && screenNames.includes(variant)
      if (isResponsive) {
        return stringifyScreen(state.config, variant)
      }

      if (variantConfig[variant]) {
        let foundVariant = variantConfig[variant]

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
        'Built-in variants': Object.keys(variantConfig),
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
    variant = className.match(/^([_a-z-]+):/)
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
    className,
    variants,
    hasVariants,
  }
}

const addVariants = ({ results, style, pieces }) => {
  const { variants } = pieces
  if (variants.length === 0) return

  const styleWithVariants = cleanSet(results, variants, {
    ...dlv(styleWithVariants, variants, {}),
    ...style,
  })

  return styleWithVariants
}

const handleVariantGroups = classes => {
  const groupedMatches = classes.match(/(\S*):\(([^\n\r()]*)\)/g)
  if (!groupedMatches) return classes

  let newClasses = classes.slice()

  groupedMatches.forEach(group => {
    const match = group.match(/(\S*):\(([^\n\r()]*)\)/)
    if (!match) return ''

    const [, variant, unwrappedClasses] = match
    const wrapped = unwrappedClasses
      .trim()
      .split(' ')
      .filter(Boolean) // remove double spaces '  '
      .map(unwrappedClass => `${variant}:${unwrappedClass}`)
      .join(' ')
    newClasses = newClasses.replace(group, wrapped)
  })

  return newClasses
}

export { splitVariants, addVariants, handleVariantGroups }
