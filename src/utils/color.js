import { withAlpha } from './../utils'

const getColor = ({ matchConfigValue, pieces }) => colors => {
  let result
  colors.find(
    ({
      matchStart,
      property,
      configSearch,
      opacityVariable,
      useSlashAlpha,
    }) => {
      // Disable slash alpha matching when a variable is supplied.
      // For classes that use opacity classes 'bg-opacity-50'.
      if (useSlashAlpha === undefined) {
        useSlashAlpha = !opacityVariable
      }

      const color = matchConfigValue(
        configSearch,
        `(?<=(${matchStart}-))([^]*)${useSlashAlpha ? `(?=/)` : ''}`
      )
      if (!color) return false

      const newColor = withAlpha({
        pieces,
        property,
        variable: opacityVariable,
        useSlashAlpha,
        color,
      })
      if (newColor) result = newColor
      return newColor
    }
  )
  return result
}

export { getColor }
