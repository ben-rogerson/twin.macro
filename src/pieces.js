import { MacroError } from 'babel-plugin-macros'
import { stringifyScreen } from './screens'
import { logNoVariant, logGeneralError } from './logging'
import { variantConfig } from './config'
import {
  get,
  throwIf,
  formatProp,
  isShortCss,
  replaceSpaceId,
  toArray,
} from './utils'
import {
  variantDarkMode,
  variantLightMode,
  prefixDarkLightModeClass,
} from './darkLightMode'

const createPeer = selector => {
  const selectors = toArray(selector)
  return selectors.map(s => `.peer:${s} ~ &`).join(', ')
}

const fullVariantConfig = variantConfig({
  variantDarkMode,
  variantLightMode,
  prefixDarkLightModeClass,
  createPeer,
})

const getVariants = ({ variants, state, ...rest }) => {
  if (!variants) return []

  const screens = get(state.config, ['theme', 'screens'])
  const screenNames = Object.keys(screens)

  return variants
    .map(variant => {
      const isResponsive = screenNames && screenNames.includes(variant)
      if (isResponsive) return stringifyScreen(state.config, variant)

      let foundVariant = fullVariantConfig[variant]

      if (!foundVariant) {
        const arbitraryVariant = variant.match(/^\[(.+)]/)
        if (arbitraryVariant) foundVariant = arbitraryVariant[1]
      }

      if (!foundVariant) {
        if (variant === 'only-child') {
          throw new MacroError(
            logGeneralError(
              'The "only-child:" variant was deprecated in favor of "only:"'
            )
          )
        }

        if (variant === 'not-only-child') {
          throw new MacroError(
            logGeneralError(
              'The "not-only-child:" variant was deprecated in favor of "not-only:"'
            )
          )
        }

        const validVariants = {
          ...(screenNames.length > 0 && { 'Screen breakpoints': screenNames }),
          'Built-in variants': Object.keys(fullVariantConfig),
        }
        throw new MacroError(logNoVariant(variant, validVariants))
      }

      if (typeof foundVariant === 'function') {
        const context = {
          ...rest,
          config: item => state.config[item] || null,
          errorCustom(message) {
            throw new MacroError(logGeneralError(message))
          },
        }
        foundVariant = foundVariant(context)
      }

      return foundVariant
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
    // Match arbitrary variants
    variant = className.match(/^([\d<>_a-z-]+):|^\[.*?]:/)

    if (variant) {
      className = className.slice(variant[0].length)
      variantsList.push(replaceSpaceId(variant[0].slice(0, -1)))
    }
  }

  // dark: and light: variants
  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/prefer-includes
  const hasDarkVariant = variantsList.some(v => v === 'dark')
  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/prefer-includes
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
  const variants = getVariants({
    variants: variantsList,
    state,
    hasDarkVariant,
    hasLightVariant,
    hasGroupVariant,
  })

  const hasVariants = variants.length > 0

  className = replaceSpaceId(className)
  return {
    classNameRawNoVariants: className,
    className,
    variants,
    hasVariants,
    hasVariantVisited: variants.includes(':visited'),
  }
}

const splitPrefix = props => {
  const { className, state } = props
  const { prefix } = state.config

  if (!prefix) return { className, hasPrefix: false }

  if (!className.startsWith(prefix)) return { className, hasPrefix: false }

  const newClassName = className.slice(prefix.length)
  return { className: newClassName, hasPrefix: true }
}

/**
 * Split the negative from the className
 */
const splitNegative = ({ className }) => {
  const hasNegative = !isShortCss(className) && className.slice(0, 1) === '-'
  if (hasNegative) className = className.slice(1, className.length)
  const negative = hasNegative ? '-' : ''
  return { className, hasNegative, negative }
}

/**
 * Split the important from the className
 */
const splitImportant = ({ className }) => {
  const hasPrefix = className.slice(0, 1) === '!'
  const hasSuffix = className.slice(-1) === '!'
  const hasImportant = hasSuffix || hasPrefix
  if (hasImportant)
    className = hasSuffix ? className.slice(0, -1) : className.slice(1)
  const important = hasImportant ? ' !important' : ''
  return { className, hasImportant, important }
}

const getAlphaValue = alpha =>
  Number.isInteger(Number(alpha)) ? Number(alpha) / 100 : alpha

const getLastSlashIndex = className => {
  const match = className.match(/\/(?![^[]*])/g)
  if (!match) return -1
  const lastSlashIndex = className.lastIndexOf(match[match.length - 1])
  return lastSlashIndex
}

// Keep after splitImportant
const splitAlpha = props => {
  const { className } = props
  const slashIdx = getLastSlashIndex(className)
  throwIf(slashIdx === className.length - 1, () =>
    logGeneralError(`The class “${className}” can’t end with a slash`)
  )
  if (slashIdx === -1) return { className, classNameNoSlashAlpha: className }

  const rawAlpha = className.slice(Number(slashIdx) + 1)
  const hasAlphaArbitrary = Boolean(
    rawAlpha[0] === '[' && rawAlpha[rawAlpha.length - 1] === ']'
  )

  const hasMatchedAlpha = Boolean(
    !hasAlphaArbitrary && get(props, 'state.config.theme.opacity')[rawAlpha]
  )

  const hasAlpha = hasAlphaArbitrary || hasMatchedAlpha || false

  const context = { hasAlpha, hasAlphaArbitrary }

  if (!hasAlpha) return { ...context, classNameNoSlashAlpha: className }

  if (hasAlphaArbitrary)
    return {
      ...context,
      alpha: formatProp(rawAlpha.slice(1, -1)),
      classNameNoSlashAlpha: className.slice(0, slashIdx),
    }

  // Opacity value has been matched in the config
  return {
    ...context,
    alpha: String(getAlphaValue(rawAlpha)),
    classNameNoSlashAlpha: className.slice(0, slashIdx),
  }
}

export { splitVariants, splitPrefix, splitImportant, splitNegative, splitAlpha }
