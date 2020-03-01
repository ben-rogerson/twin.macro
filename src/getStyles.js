import dlv from 'dlv'
import { staticStyles, dynamicStyles } from './config'
import { resolveStyle } from './utils'
import { assignify, astify } from './macroHelpers'
import splitter from './splitter'
import { mergeVariants, validateVariants } from './variants'
import { mergeImportant } from './important'
import {
  logInOut,
  logNoClass,
  logNoTrailingDash,
  softMatchConfigs
} from './logging'
import { orderByScreens } from './screens'
import { MacroError } from 'babel-plugin-macros'

export default function getStyles(str, t, state) {
  // Move and sort the responsive items to the end of the list
  const classList = str.match(/\S+/g) || []
  const order = Object.keys(state.config.theme.screens)
  const classListOrdered = orderByScreens(classList, order)

  const styles = classListOrdered.reduce((acc, classNameRaw, index) => {
    if (classNameRaw.endsWith('-')) {
      throw new MacroError(logNoTrailingDash(classNameRaw))
    }
    const { className, modifiers, hasImportant, hasNegative } = splitter(
      classNameRaw
    )
    const prefix = hasNegative ? '-' : ''

    // Match the filtered modifiers
    const matchedVariants = validateVariants({
      modifiers,
      state
    })

    // Match against plugin classNames Get classnames from plugin
    const pluginMatch = resolveStyleFromPlugins({
      config: state.config,
      className
    })
    if (pluginMatch) {
      const pluginStyleImportant = mergeImportant(pluginMatch, hasImportant)
      const pluginOutput = mergeVariants({
        variants: matchedVariants,
        objBase: acc,
        objToMerge: pluginStyleImportant
      })
      state.debug && console.log(logInOut(className, pluginStyleImportant))
      return pluginOutput
    }

    const staticConfig = dlv(staticStyles, [className, 'config'])
    const staticConfigOutput = dlv(staticStyles, [className, 'output'])
    const staticConfigKey = staticConfigOutput
      ? Object.keys(staticConfigOutput).shift()
      : null

    const staticStyleKey = !!staticConfig ? staticConfig : staticConfigKey

    // Get an array of matches (eg: ['col', 'col-span'])
    const dynamicKeyMatches =
      Object.keys(dynamicStyles).filter(
        k => className.startsWith(k + '-') || className === k
      ) || []
    // Get the best match from the match array
    const dynamicKey = dynamicKeyMatches.reduce(
      (r, e) => (r.length < e.length ? e : r),
      []
    )
    const dynamicStyleset = dlv(dynamicStyles, dynamicKey)
    const dynamicStyleKey = Array.isArray(dynamicStyleset)
      ? dynamicStyleset.map(i => dlv(i, 'config'))
      : dlv(dynamicStyles, [dynamicKey, 'config'])

    // Exit early if no className is found in both configs
    if (!staticStyleKey && !dynamicStyleKey) {
      const config = softMatchConfigs({
        className,
        configTheme: state.config.theme,
        prefix
      })
      throw new MacroError(
        logNoClass({
          className: `${prefix}${className}`,
          config
        })
      )
    }

    if (staticStyleKey) {
      const staticStyleOutput = dlv(staticStyles, [className, 'output'])
      if (!staticStyleOutput) {
        throw new MacroError(
          `No output value found for ${className} in static config`
        )
      }

      const staticStyleImportant = mergeImportant(
        staticStyleOutput,
        hasImportant
      )

      const mergedStaticOutput = mergeVariants({
        variants: matchedVariants,
        objBase: acc,
        objToMerge: staticStyleImportant
      })

      state.debug && console.log(logInOut(className, staticStyleImportant))

      return state.isProd ? mergedStaticOutput : ''

      // [c]:
      //   '__computed__' +
      //   pre +
      //   state.tailwindConfigIdentifier.name +
      //   '.theme.' +
      //   styleConfigKey +
      //   '["' +
      //   key +
      //   '"]'
    }

    const key = className.substr(dynamicKey.length + 1)

    const results = state.isProd
      ? resolveStyle({
          config: state.config,
          styleList: dynamicStyleset,
          key,
          className,
          matchedKey: dynamicKey,
          prefix
        })
      : {
          ['__spread__' + index]:
            state.tailwindUtilsIdentifier.name +
            '.resolveStyle(' +
            state.tailwindConfigIdentifier.name +
            ', ' +
            JSON.stringify(dynamicStyles[dynamicKey]) +
            ',"' +
            key +
            '")'
        }

    const dynamicStyleImportant = mergeImportant(results, hasImportant)

    const mergedDynamicOutput = mergeVariants({
      variants: matchedVariants,
      objBase: acc,
      objToMerge: dynamicStyleImportant
    })

    state.debug && console.log(logInOut(className, dynamicStyleImportant))

    return mergedDynamicOutput
  }, {})

  const ast = state.isDev ? assignify(ast, t) : astify(styles, t)
  return ast
}
