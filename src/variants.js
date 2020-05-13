import { MacroError } from 'babel-plugin-macros'
import dlv from 'dlv'
import cleanSet from 'clean-set'
import { stringifyScreen } from './screens'
import { logNoVariant } from './logging'
import { variantConfig } from './config'

/**
 * Validate variants against the variants config key
 */
const validateVariants = ({ variants, state }) => {
  if (!variants) return []

  const screens = dlv(state.config, ['theme', 'screens'])
  const screenNames = Object.keys(screens)
  const validVariants = [...Object.keys(variantConfig), ...screenNames]
  return variants
    .map(variant => {
      const isResponsive = screenNames && screenNames.includes(variant)
      if (isResponsive) {
        return stringifyScreen(state.config, variant)
      }

      // Check variants against valid variants
      if (variantConfig[variant]) {
        return variantConfig[variant]
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

  // Match the filtered variants
  const variants = validateVariants({
    variants: variantsList,
    state,
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

export { splitVariants, addVariants }
