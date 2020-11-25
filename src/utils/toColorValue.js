export const toColorValue = maybeFunction =>
  typeof maybeFunction === 'function' ? maybeFunction({}) : maybeFunction
