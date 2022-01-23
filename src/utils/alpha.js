import createColor from 'color'
import { throwIf } from './misc'

function hasAlpha(color) {
  return (
    color.startsWith('rgba(') ||
    color.startsWith('hsla(') ||
    (color.startsWith('#') && color.length === 9) ||
    (color.startsWith('#') && color.length === 5)
  )
}

function toRgba(color) {
  const [r, g, b, a] = createColor(color).rgb().array()
  return [r, g, b, a === undefined && hasAlpha(color) ? 1 : a]
}

function toHsla(color) {
  const [h, s, l, a] = createColor(color).hsl().array()
  return [h, s, l, a === undefined && hasAlpha(color) ? 1 : a]
}

const toPercent = value => (value > 0 ? `${value}%` : value)

const colorMap = {
  hsl: color => {
    const [h, s, l, a] = toHsla(color)
    return {
      values: [h, toPercent(s), toPercent(l)].join(' '),
      alpha: a,
      prefix: 'hsl',
      alphaPrefix: 'hsl',
    }
  },
  rgb: color => {
    const [r, g, b, a] = toRgba(color)
    return {
      values: [r, g, b].join(' '),
      alpha: a,
      prefix: 'rgb',
      alphaPrefix: 'rgb',
    }
  },
}

const makeColorValue = color => {
  const type = color.slice(0, 3)
  const colorType = colorMap[type] || colorMap.rgb
  let alphaValue

  const colorValue = ({ a }) => {
    const { alphaPrefix, prefix, values, alpha } = colorType(color)
    alphaValue = alpha !== undefined ? alpha : a
    const finalColor = [values, alphaValue].filter(i => i !== undefined)
    const finalPrefix = alphaValue !== undefined ? alphaPrefix : prefix
    return `${finalPrefix}(${finalColor.join(' / ')})`
  }

  return [colorValue, alphaValue]
}

const withAlpha = ({
  color,
  property,
  variable,
  pieces = {},
  useSlashAlpha = pieces.hasAlpha,
  hasFallback = true,
}) => {
  if (!color) return

  // Validate the slash opacity and show an error that was generated earlier
  throwIf(useSlashAlpha && pieces.alphaError, pieces.alphaError)

  if (typeof color === 'function') {
    if (variable && property) {
      const value = color({
        opacityVariable: variable,
        opacityValue: `var(${variable})`,
      })
      return { [variable]: '1', [property]: value }
    }

    color = color({ opacityVariable: variable })
  }

  if (!property && !useSlashAlpha) return `${color}${pieces.important}`

  try {
    const [colorValue, a] = makeColorValue(color)

    if (!useSlashAlpha) {
      if (!variable || color.startsWith('var('))
        // a !== undefined ||
        return { [property]: `${color}${pieces.important}` }

      const value = colorValue({ a: `var(${variable})` })
      return {
        ...(value.includes('var(') && { [variable]: '1' }),
        [property]: `${value}${pieces.important}`,
      }
    }

    const value = `${
      (pieces.hasAlpha && colorValue({ a: pieces.alpha })) ||
      (a && colorValue()) ||
      colorValue()
    }${pieces.important}`
    return property ? { [property]: value } : value
  } catch (_) {
    if (!hasFallback) return
    return { [property]: `${color}${pieces.important}` }
  }
}

const transparentTo = value => {
  if (typeof value === 'function') {
    value = value({ opacityValue: 0 })
  }

  try {
    const [r, g, b] = toRgba(value)
    return `rgb(${r} ${g} ${b} / 0)`
  } catch (_) {
    return `rgb(255 255 255 / 0)`
  }
}

export { toRgba, withAlpha, transparentTo }
