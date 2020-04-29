import dset from 'dset'
import processPlugins from 'tailwindcss/lib/util/processPlugins'

export default ({ config, className }) => {
  const pluginClassNames = {}

  if (!config.plugins || config.plugins.length === 0) {
    return
  }

  const processedPlugins = processPlugins(config.plugins, config)
  // Only plugin utilities for now, plugin components are much more complex
  // This mimics the tailwind.macro functionality
  processedPlugins.utilities.forEach(rule => {
    if (rule.type !== 'atrule' || rule.name !== 'variants') {
      return
    }

    rule.each(x => {
      const match = x.selector.match(/^\.(\S+)(\s+.*?)?$/)
      if (match === null) {
        return
      }

      const name = match[1]
      const rest = match[2]
      const keys = rest ? [name, rest.trim()] : [name]
      dset(pluginClassNames, keys, {})
      x.walkDecls(decl => {
        dset(pluginClassNames, keys.concat(decl.prop), decl.value)
      })
    })
  })
  const output =
    typeof pluginClassNames[className] !== 'undefined'
      ? pluginClassNames[className]
      : null

  return output
}
