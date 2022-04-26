import { parseColor, formatColor } from 'tailwindcss/lib/util/color'
import { color, gradient } from 'tailwindcss/lib/util/dataTypes'
import { isSpaceSeparatedColor } from './misc'

const buildStyleSet = (property, color, pieces) => {
  const value = `${color}${pieces.important}`
  if (!property) return value
  return { [property]: value }
}

const maybeAddAlpha = (value, { pieces, variable = '' }) =>
  typeof value === 'function' ||
  (pieces.alpha && typeof value === 'string' && color(value))
    ? toAlpha({ pieces, variable, property: undefined })(
        value,
        pieces.alpha,
        value
      )
    : value

const toAlpha =
  ({ pieces, property, variable }) =>
  (color, alpha, fallBackColor) => {
    const newPieces =
      (pieces.hasVariantVisited && { ...pieces, alpha: '', hasAlpha: false }) ||
      (alpha && { ...pieces, alpha, hasAlpha: true }) ||
      pieces

    return withAlpha({
      color,
      property,
      ...(!pieces.hasVariantVisited && { variable }),
      pieces: newPieces,
      fallBackColor,
    })
  }

const withAlpha = ({
  color,
  property,
  variable,
  pieces = { hasAlpha: false, alpha: '', important: '' },
  fallBackColor = false,
}) => {
  if (!color) return

  if (Array.isArray(color)) color = color.join(',')

  if (typeof color === 'function') {
    if (variable && property) {
      if (pieces.hasAlpha)
        return buildStyleSet(
          property,
          color({ opacityValue: pieces.alpha }),
          pieces
        )

      return {
        [variable]: '1',
        [property]: `${color({
          opacityVariable: variable,
          opacityValue: `var(${variable})`,
        })}${pieces.important}`,
      }
    }

    color = color({ opacityVariable: variable })
  }

  const parsed = parseColor(color)

  if (parsed === null) {
    // next-line: "!fallBackColor" is a workaround for variables used within these classes:
    // from-[var(--color)] + via-[var(--color)]
    const hasValidSpaceSeparatedColors =
      !fallBackColor && isSpaceSeparatedColor(color)
    if (hasValidSpaceSeparatedColors)
      return buildStyleSet(property, color, pieces)

    if (gradient(color)) return buildStyleSet(property, color, pieces)

    if (fallBackColor) return buildStyleSet(property, fallBackColor, pieces)

    return
  }

  if (parsed.alpha !== undefined) {
    // For gradients
    if (color === 'transparent' && fallBackColor)
      return buildStyleSet(
        property,
        pieces.alpha ? formatColor({ ...parsed, alpha: pieces.alpha }) : color,
        pieces
      )

    // Has an alpha value, return color as-is
    return buildStyleSet(property, color, pieces)
  }

  if (pieces.alpha)
    return buildStyleSet(
      property,
      formatColor({ ...parsed, alpha: pieces.alpha }),
      pieces
    )

  if (variable)
    return {
      [variable]: '1',
      [property]: `${formatColor({ ...parsed, alpha: `var(${variable})` })}${
        pieces.important
      }`,
    }

  return buildStyleSet(property, color, pieces)
}

export { maybeAddAlpha, toAlpha, withAlpha }
