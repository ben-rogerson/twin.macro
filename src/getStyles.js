import dlv from 'dlv'
import { resolveStyle, resolveStyleFromPlugins, assert } from './utils'
import { staticStyles, dynamicStyles } from './config'
import { SPREAD_ID, assignify, astify } from './macroHelpers'
import splitter from './splitter'
import { mergeVariants, validateVariants } from './variants'
import { mergeImportant } from './important'
import { getContainerStyles } from './container'
import {
  logInOut,
  logNoClass,
  logNoTrailingDash,
  logBadGood,
  softMatchConfigs,
} from './logging'
import { orderByScreens } from './screens'

export default function getStyles(string, t, state) {
  // Move and sort the responsive items to the end of the list
  const classList = string.match(/\S+/g) || []
  const configScreens = Object.keys(state.config.theme.screens)
  const classListOrdered = orderByScreens(classList, configScreens)

  const styles = classListOrdered.reduce((accumulator, classNameRaw, index) => {
    assert(
      classNameRaw === 'group',
      `"group" must be added as className:\n\n${logBadGood(
        'tw`group`',
        '<div className="group">'
      )}\n`
    )

    assert(classNameRaw.endsWith('-'), logNoTrailingDash(classNameRaw))

    // Container
    if (['container', 'container-auto'].includes(classNameRaw)) {
      const { container, screens } = dlv(state, ['config', 'theme'])
      const containerStyles = getContainerStyles({
        isCentered: classNameRaw === 'container-auto',
        screens: Object.values(screens),
        padding: container.padding,
      })
      if (containerStyles) {
        return containerStyles
      }
    }

    const { className, modifiers, hasImportant, hasNegative } = splitter(
      classNameRaw
    )
    const prefix = hasNegative ? '-' : ''

    // Match the filtered modifiers
    const matchedVariants = validateVariants({
      modifiers,
      state,
    })

    // Match against plugin classNames
    const pluginMatch = resolveStyleFromPlugins({
      config: state.config,
      className,
    })
    if (pluginMatch) {
      const important = mergeImportant(pluginMatch, hasImportant)
      const pluginOutput = mergeVariants({
        variants: matchedVariants,
        objBase: accumulator,
        objToMerge: important,
      })
      state.debug && console.log(logInOut(className, important))
      return pluginOutput
    }

    const staticConfig = dlv(staticStyles, [className, 'config'])
    const staticConfigOutput = dlv(staticStyles, [className, 'output'])
    const staticConfigKey = staticConfigOutput
      ? Object.keys(staticConfigOutput).shift()
      : null

    const staticStyleKey = staticConfig || staticConfigKey

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
    const dynamicStyleset = dlv(dynamicStyles, dynamicKey)
    const dynamicStyleKey = Array.isArray(dynamicStyleset)
      ? dynamicStyleset.map(i => dlv(i, 'config'))
      : dlv(dynamicStyles, [dynamicKey, 'config'])

    // Exit early if no className is found in both configs
    assert(
      !staticStyleKey && !dynamicStyleKey,
      logNoClass({
        className: `${prefix}${className}`,
        config: softMatchConfigs({
          className,
          configTheme: state.config.theme,
          prefix,
        }),
        hasSuggestions: state.hasSuggestions,
      })
    )

    if (staticStyleKey) {
      const staticStyleOutput = dlv(staticStyles, [className, 'output'])

      assert(
        !staticStyleOutput,
        `No output value found for ${className} in static config`
      )

      const important = mergeImportant(staticStyleOutput, hasImportant)

      const mergedStaticOutput = mergeVariants({
        variants: matchedVariants,
        objBase: accumulator,
        objToMerge: important,
      })

      state.debug && console.log(logInOut(className, important))

      return state.isProd ? mergedStaticOutput : ''

      // [c]:
      //   COMPUTED_ID +
      //   pre +
      //   state.tailwindConfigIdentifier.name +
      //   '.theme.' +
      //   styleConfigKey +
      //   '["' +
      //   key +
      //   '"]'
    }

    const key = className.slice(dynamicKey.length + 1)

    const results = state.isProd
      ? resolveStyle({
          config: state.config,
          styleList: dynamicStyleset,
          key,
          className,
          matchedKey: dynamicKey,
          prefix,
          hasSuggestions: state.hasSuggestions,
        })
      : {
          [`${SPREAD_ID}${index}`]: `${
            state.tailwindUtilsIdentifier.name
          }.resolveStyle("${
            state.tailwindConfigIdentifier.name
          }, ${JSON.stringify(dynamicStyles[dynamicKey])}, "${key}")`,
        }

    const dynamicStyleImportant = mergeImportant(results, hasImportant)

    // The placeholder class requires a custom prefix
    const isPlaceholder = className.startsWith('placeholder-')
    const dynamicStylePlaceholder = isPlaceholder
      ? { '::placeholder': dynamicStyleImportant }
      : dynamicStyleImportant

    const mergedDynamicOutput = mergeVariants({
      variants: matchedVariants,
      objBase: accumulator,
      objToMerge: dynamicStylePlaceholder,
    })

    // TODO: Find how to add variants to debug (eg: media queries, before)
    state.debug && console.log(logInOut(className, dynamicStylePlaceholder))

    return mergedDynamicOutput
  }, {})

  const ast = state.isDev ? assignify(styles, t) : astify(styles, t)
  return ast
}
