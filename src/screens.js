import { get, toArray } from './utils'

const stringifyScreen = (config, screenName) => {
  const screen = get(config, ['theme', 'screens', screenName])
  if (typeof screen === 'undefined') {
    throw new Error(
      `Couldn’t find Tailwind the screen "${screenName}" in the Tailwind config`
    )
  }

  if (typeof screen === 'string') return `@media (min-width: ${screen})`
  if (typeof screen.raw === 'string') {
    return `@media ${screen.raw}`
  }

  const string = toArray(screen)
    .map(range =>
      [
        typeof range.min === 'string' ? `(min-width: ${range.min})` : null,
        typeof range.max === 'string' ? `(max-width: ${range.max})` : null,
      ]
        .filter(Boolean)
        .join(' and ')
    )
    .join(', ')
  return string ? `@media ${string}` : ''
}

export { stringifyScreen }
