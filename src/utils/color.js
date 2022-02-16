import deepMerge from 'lodash.merge'
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

      const values = Array.isArray(property) ? property : [property]
      const res = values
        .map(p =>
          withAlpha({
            color,
            property: p,
            pieces,
            useSlashAlpha,
            variable: opacityVariable,
          })
        )
        .filter(Boolean)

      if (res.length === 0) return false

      result = deepMerge(...res)
      return true
    }
  )
  return result
}

export { getColor }
