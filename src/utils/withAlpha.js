import createColor from 'color'

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

export default ({ color, property, variable, important }) => {
  if (typeof color === 'function') {
    return {
      [property]: `${color({
        opacityVariable: variable,
        opacityValue: `var(${variable})`,
      })}${important}`,
    }
  }

  const colorValue = `${color}${important}`
  try {
    const [r, g, b, a] = toRgba(color)

    if (a !== undefined || !variable) {
      return { [property]: colorValue }
    }

    return {
      [variable]: '1',
      [property]: `rgba(${r}, ${g}, ${b}, var(${variable}))${important}`,
    }
  } catch (_) {
    return {
      [property]: colorValue,
    }
  }
}

const transparentTo = value => {
  if (typeof value === 'function') {
    return value({ opacityValue: 0 })
  }

  try {
    const [r, g, b] = toRgba(value)
    return `rgba(${r}, ${g}, ${b}, 0)`
  } catch (_) {
    return `rgba(255, 255, 255, 0)`
  }
}

export { toRgba, transparentTo }
