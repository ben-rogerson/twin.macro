import { MacroError } from 'babel-plugin-macros'
import { logNoClass, softMatchConfigs } from './../logging'
import { assert, isEmpty } from './../utils'
import { getMatch } from './dynamicUtils'

function resolveStyle(properties) {
  const {
    styleList,
    key,
    className,
    prefix,
    config,
    hasSuggestions,
  } = properties
  // Deal with Array items like 'font' or 'bg'
  if (Array.isArray(styleList)) {
    const resultsRaw = styleList.map(item => getMatch(item, ...properties))
    const results = Object.values(resultsRaw).find(
      x => x && Object.values(x)[0] !== undefined
    )
    assert(
      !results,
      // TODO: Add class suggestions for these types
      logNoClass({
        className: `${prefix}${className}`,
        hasSuggestions,
      })
    )

    return results
  }

  if (typeof styleList === 'object') {
    const results = getMatch(styleList, ...properties)
    assert(
      isEmpty(results),
      logNoClass({
        className: `${prefix}${className}`,
        hasSuggestions,
        config: softMatchConfigs({
          className,
          configTheme: config.theme,
          prefix,
        }),
      })
    )

    return results
  }

  throw new MacroError(
    `"${className}" requires "${key}" in the Tailwind config`
  )
}

const handleDynamic = ({ pieces, state, dynamicKey, dynamicStyleset }) => {
  const { className, negative } = pieces
  const key = className.slice(Number(dynamicKey.length) + 1)

  const style = resolveStyle({
    config: state.config,
    styleList: dynamicStyleset,
    key,
    className,
    matchedKey: dynamicKey,
    prefix: negative,
    hasSuggestions: state.hasSuggestions,
  })

  assert(
    !style,
    logNoClass({
      className: `${negative}${className}`,
      hasSuggestions: false,
    })
  )

  return style
}

export default handleDynamic
