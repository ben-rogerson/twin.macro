import type { AssertContext } from 'core/types'
import { makeColor } from './logging'

function createAssert(
  CustomError = Error,
  isSilent = false,
  hasLogColors = true
) {
  return (
    expression: boolean | string | (({ color }: AssertContext) => string),
    message: string | (({ color }: AssertContext) => string)
  ): void => {
    if (isSilent) return

    if (typeof expression === 'string') {
      throw new CustomError(`\n\n${expression}\n`)
    }

    const messageContext = { color: makeColor(hasLogColors) }

    if (typeof expression === 'function') {
      throw new CustomError(`\n\n${expression(messageContext)}\n`)
    }

    if (expression) return

    if (typeof message === 'string') {
      throw new CustomError(`\n\n${message}\n`)
    }

    if (typeof message === 'function') {
      throw new CustomError(`\n\n${message(messageContext)}\n`)
    }
  }
}

export default createAssert
