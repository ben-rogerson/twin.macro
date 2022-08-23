import colors from './colors'
// eslint-disable-next-line import/no-relative-parent-imports
import type { MakeColor } from '../types'

export function makeColor(hasColor: boolean): MakeColor {
  return (message: string, type: keyof typeof colors = 'error') => {
    if (!hasColor) return message
    return colors[type](message)
  }
}
