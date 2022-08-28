import colors from './colors'
import type { MakeColor } from 'suggestions/types'

export function makeColor(hasColor: boolean): MakeColor {
  return (message: string, type: keyof typeof colors = 'error') => {
    if (!hasColor) return message
    return colors[type](message)
  }
}
