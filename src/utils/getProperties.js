import { staticStyles, dynamicStyles } from './../config'
import { get } from './misc'

const isStaticClass = className => {
  const staticConfig = get(staticStyles, [className, 'config'])
  const staticConfigOutput = get(staticStyles, [className, 'output'])
  const staticConfigKey = staticConfigOutput
    ? Object.keys(staticConfigOutput).shift()
    : null

  return Boolean(staticConfig || staticConfigKey)
}

const getDynamicProperties = className => {
  // Get an array of matches (eg: ['col', 'col-span'])
  const dynamicKeyMatches =
    Object.keys(dynamicStyles).filter(
      k => className.startsWith(k + '-') || className === k
    ) || []

  // Get the best match from the match array
  const dynamicKey = dynamicKeyMatches.reduce(
    (r, match) => (r.length < match.length ? match : r),
    []
  )
  const dynamicConfig = dynamicStyles[dynamicKey] || {}

  // See if the config property is defined
  const isDynamicClass = Boolean(
    Array.isArray(dynamicConfig)
      ? dynamicConfig.map(item => get(item, 'config'))
      : get(dynamicStyles, [dynamicKey, 'config'])
  )

  return { isDynamicClass, dynamicConfig, dynamicKey }
}

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)

const getProperties = (className, state) => {
  if (!className) return
  const isStatic = isStaticClass(className)
  const { isDynamicClass, dynamicConfig, dynamicKey } = getDynamicProperties(
    className
  )
  const corePlugin = dynamicConfig.plugin
  const hasUserPlugins = !isEmpty(state.config.plugins)

  const type =
    (isStatic && 'static') ||
    (isDynamicClass && 'dynamic') ||
    (corePlugin && 'corePlugin')

  return {
    type,
    corePlugin,
    hasMatches: Boolean(type),
    dynamicKey,
    dynamicConfig,
    hasUserPlugins,
  }
}

export default getProperties
