import { parseColor, formatColor } from 'tailwindcss/lib/util/color'
import { gradient } from 'tailwindcss/lib/util/dataTypes'

const buildStyleSet = (property, color, pieces) => {
  const value = `${color}${pieces.important}`
  if (!property) return value
  return { [property]: value }
}

const withAlpha = ({
  color,
  property,
  variable,
  pieces = {},
  fallBackColor,
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
    // Check for space separated color values
    const spaceMatch =
      typeof color === 'string' ? color.split(/\s+(?=[^)\]}]*(?:[([{]|$))/) : []

    if (spaceMatch.length > 1) {
      const hasValidSpaceSeparatedColors = spaceMatch.every(color =>
        Boolean(/^var\(--\w*\)$/.exec(color) ? color : parseColor(color))
      )
      if (!hasValidSpaceSeparatedColors) return
      return buildStyleSet(property, color, pieces)
    }

    if (gradient(color)) return buildStyleSet(property, color, pieces)

    if (fallBackColor) return buildStyleSet(property, fallBackColor, pieces)

    return
  }

  if (parsed.alpha !== undefined) {
    // For gradients
    if (color === 'transparent' && fallBackColor)
      return buildStyleSet(
        property,
        formatColor({ ...parsed, alpha: pieces.alpha }),
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

export { withAlpha }
