import dlv from 'dlv'

const stringifyScreen = (config, screenName) => {
  const screen = dlv(config, ['theme', 'screens', screenName])
  if (typeof screen === 'undefined') {
    throw new Error(
      `Couldn’t find Tailwind the screen "${screenName}" in the Tailwind config`
    )
  }
  if (typeof screen === 'string') return `@media (min-width: ${screen})`
  if (typeof screen.raw === 'string') {
    return `@media ${screen.raw}`
  }
  const str = (Array.isArray(screen) ? screen : [screen])
    .map(range => {
      return [
        typeof range.min === 'string' ? `(min-width: ${range.min})` : null,
        typeof range.max === 'string' ? `(max-width: ${range.max})` : null
      ]
        .filter(Boolean)
        .join(' and ')
    })
    .join(', ')
  return str ? `@media ${str}` : ''
}

const orderByScreens = (classNames, screens) =>
  classNames.sort((a, b) => {
    const A = a.includes(':') ? a.split(':')[0] : a
    const B = b.includes(':') ? b.split(':')[0] : b
    return screens.indexOf(A) < screens.indexOf(B) ? -1 : 1
  })

export { stringifyScreen, orderByScreens }
