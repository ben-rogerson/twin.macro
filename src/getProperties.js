import { corePlugins } from './config'
import {
  isShortCss as getIsShortCss,
  isArbitraryCss,
  toArray,
} from './utils/misc'

const getCorePluginProperties = className => {
  const matches = Object.entries(corePlugins)
    .map(item => {
      const [pluginName, config] = item
      if (className === pluginName) return item

      const startsWithPluginName = className.startsWith(
        String(pluginName) + '-'
      )
      if (!startsWithPluginName) return

      const supportsFurtherMatching = toArray(config).some(i =>
        Boolean(i.config)
      )
      if (!supportsFurtherMatching) return

      return item
    })
    .filter(Boolean)

  if (matches.length === 0) return { isCorePluginClass: false }

  const longestMatch = matches.sort((a, b) =>
    a[0].length > b[0].length ? -1 : 1
  )[0]
  const [corePluginName, coreConfig] = longestMatch

  return {
    isCorePluginClass: true,
    coreConfig: toArray(coreConfig),
    corePluginName,
  }
}

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)

export const getProperties = (className, state, { isCsOnly = false }) => {
  if (!className) return

  const isShortCss = getIsShortCss(className)
  if (isCsOnly || isShortCss)
    return { hasMatches: isShortCss, type: 'shortCss' }

  if (isArbitraryCss(className))
    return { hasMatches: true, type: 'arbitraryCss' }

  const { isCorePluginClass, coreConfig, corePluginName } =
    getCorePluginProperties(className)

  return {
    type: isCorePluginClass && 'dynamic',
    hasMatches: Boolean(isCorePluginClass),
    hasUserPlugins: !isEmpty(state.config.plugins),
    coreConfig,
    corePluginName,
  }
}
