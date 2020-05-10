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
  const colorValue = `${color}${important}`
  try {
    const [r, g, b, a] = toRgba(color)

    if (a !== undefined) {
      return { [property]: colorValue }
    }

    return {
      [variable]: '1',
      // Duplicate keys aren't possible in js objects, but totally fine in css
      // (eg: { "color": "#000", "color": "rgba(255,255,255,.5)" } = error
      // So nesting the duplicate key under the & is the workaround
      [property]: colorValue,
      '&': {
        [property]: `rgba(${r}, ${g}, ${b}, var(${variable}))${important}`,
      },
    }
  } catch (_) {
    return {
      [property]: colorValue,
    }
  }
}
