// eslint-disable-next-line import/no-relative-parent-imports
import type { MessageContext } from '../types'
import { color } from './logging'

function createAssert(CustomError = Error, isSilent = false) {
  return (
    expression: boolean | string | (({ color }: MessageContext) => string),
    message: string | (({ color }: MessageContext) => string)
  ): void => {
    if (isSilent) return

    if (typeof expression === 'string') {
      throw new CustomError(`\n\n${expression}\n\n`)
    }

    const messageContext = { color }

    if (typeof expression === 'function') {
      throw new CustomError(`\n\n${expression(messageContext)}\n\n`)
    }

    if (expression) return

    if (typeof message === 'string') {
      throw new CustomError(`\n\n${message}\n\n`)
    }

    if (typeof message === 'function') {
      throw new CustomError(`\n\n${message(messageContext)}\n\n`)
    }
  }
}

export default createAssert
