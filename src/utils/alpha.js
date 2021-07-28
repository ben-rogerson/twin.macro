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

const withAlpha = ({
  color,
  property,
  variable,
  pieces,
  useSlashAlpha = variable ? !variable : true,
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
    const [r, g, b, a] = toRgba(color)

    if (!useSlashAlpha) {
      if (a !== undefined || !variable)
        return { [property]: `${color}${pieces.important}` }

      return {
        [variable]: '1',
        [property]: `rgba(${[r, g, b, `var(${variable})`].join(', ')})${
          pieces.important
        }`,
      }
    }

    const value = `${
      pieces.hasAlpha
        ? `rgba(${[r, g, b, pieces.alpha].join(', ')})`
        : `rgb(${[r, g, b].join(', ')})`
    }${pieces.important}`
    return property ? { [property]: value } : value
  } catch (_) {
    return { [property]: `${color}${pieces.important}` }
  }
}

const transparentTo = value => {
  if (typeof value === 'function') {
    value = value({ opacityValue: 0 })
  }

  try {
    const [r, g, b] = toRgba(value)
    return `rgba(${r}, ${g}, ${b}, 0)`
  } catch (_) {
    return `rgba(255, 255, 255, 0)`
  }
}

export { toRgba, withAlpha, transparentTo }
