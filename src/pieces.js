import { MacroError } from 'babel-plugin-macros'
import { logNoVariant, logGeneralError } from './logging'
import {
  get,
  throwIf,
  formatProp,
  isShortCss,
  replaceSpaceId,
  getFirstValue,
} from './utils'

const logVariantError = (variant, state) => {
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

  throw new MacroError(logNoVariant(variant, state))
}

const getVariants = ({ variants, state, className }) => {
  if (!variants) return []

  const list = variants
    .map(variant => {
      const arbitraryVariant = variant.match(/^\[(.+)]/)
      if (arbitraryVariant) return arbitraryVariant[1]

      let [foundVariant] = getFirstValue(
        [...state.userPluginData.variants],
        ([name, value]) => (name === variant ? value.join(', ') : false)
      )

      if (typeof foundVariant === 'function') {
        const context = {
          className,
          config: item => state.config[item] || null,
        }
        foundVariant = foundVariant(context)
      }

      if (!foundVariant) logVariantError(variant, state)

      return foundVariant
    })
    .filter(Boolean)

  return list
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

  className = replaceSpaceId(className)

  // Match the filtered variants
  const variants = getVariants({ variants: variantsList, state, className })

  const hasVariants = variants.length > 0

  return {
    classNameRawNoVariants: className,
    className,
    variants,
    hasVariants,
    avoidAlpha: variants.includes(':visited'),
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

  // Arbitrary slash alpha values, eg: `bg-black/[.50]`
  if (hasAlphaArbitrary)
    return {
      hasAlpha: true,
      hasAlphaArbitrary,
      alpha: formatProp(rawAlpha.slice(1, -1)),
      classNameNoSlashAlpha: className.slice(0, slashIdx),
    }

  const opacityConfig = get(props, 'state.config.theme.opacity')
  const hasMatchedAlpha = Boolean(opacityConfig[rawAlpha])

  if (!hasMatchedAlpha)
    return {
      hasAlpha: false,
      classNameNoSlashAlpha: className,
      // Set some error data for later - we still don't know if the className is
      // incorrect as there could be a slash in the className, eg: `h-2/4`
      alphaError: [
        `The slash opacity “${rawAlpha}” isn’t a valid opacity for “${className}”`,
        `Try one of these opacity values:`,
        opacityConfig,
      ],
    }

  // Opacity value has been matched in the config
  return {
    alpha: String(getAlphaValue(rawAlpha)),
    hasAlpha: hasMatchedAlpha,
    classNameNoSlashAlpha: className.slice(0, slashIdx),
  }
}

export { splitVariants, splitPrefix, splitImportant, splitNegative, splitAlpha }
