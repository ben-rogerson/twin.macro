import { color } from './logging'

const createAssert =
  (CustomError = Error, isSilent = false) =>
  (expression, message) => {
    if (isSilent) return

    if (typeof expression === 'string') {
      throw new CustomError(`\n\n${expression}\n\n`)
    }

    if (typeof expression === 'function') {
      throw new CustomError(`\n\n${expression(color)}\n\n`)
    }

    if (expression) return

    if (typeof message === 'string') {
      throw new CustomError(`\n\n${message}\n\n`)
    }

    if (typeof message === 'function') {
      throw new CustomError(`\n\n${message(color)}\n\n`)
    }
  }

export default createAssert
