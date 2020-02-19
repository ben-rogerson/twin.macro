import dset from 'dset'
import dlv from 'dlv'
import chalk from 'chalk'
import staticStyles from './config/staticStyles'
import dynamicStyles from './config/dynamicStyles'
import { stringifyScreen, resolveStyle } from './utils'
import showError from './showError'
import astify from './astify'
import assignify from './assignify'

/**
 * Get the variant(s) from the className
 */
const splitVariants = className => {
  let modifiers = []
  let modifier
  while (modifier !== null) {
    modifier = className.match(/^([a-z-_]+):/i)
    if (modifier) {
      className = className.substr(modifier[0].length)
      modifiers.push(modifier[1])
    }
  }
  return { className, modifiers }
}

/**
 * Merge the modifiers
 */
const mergeVariants = ({ variants, objBase, objToMerge }) => {
  if (!objToMerge) return objBase
  if (!variants.length) {
    return {
      ...objBase,
      ...objToMerge
    }
  }
  // TODO: Replace dset
  dset(objBase, variants, {
    ...dlv(objBase, variants, {}),
    ...objToMerge
  })
  return objBase
}

/**
 * Validate modifiers against the variants config key
 */
const validateVariants = ({ modifiers, state }) => {
  if (!modifiers) return []

  const availableModifiers = [
    'group',
    'group-hover',
    'focus-within',
    'first',
    'last',
    'odd',
    'even',
    'hover',
    'focus',
    'active',
    'visited',
    'disabled'
  ]
  const themeScreens = dlv(state.config, ['theme', 'screens'])
  const themeScreenKeys = Object.keys(themeScreens)
  const validModifiers = [...availableModifiers, ...themeScreenKeys]

  return modifiers
    .map(mod => {
      if (mod === 'group') {
        return '.group &'
      }
      if (mod === 'group-hover') {
        return '.group:hover &'
      }
      if (mod === 'focus-within') {
        return ':focus-within'
      }
      if (mod === 'first') {
        return ':first-child'
      }
      if (mod === 'last') {
        return ':last-child'
      }
      if (mod === 'odd') {
        return ':nth-child(odd)'
      }
      if (mod === 'even') {
        return ':nth-child(even)'
      }

      // Get theme screen
      const isModResponsive = themeScreenKeys && themeScreenKeys.includes(mod)

      if (isModResponsive) {
        const isModResponsiveAllowed = validModifiers.includes(mod)
        if (isModResponsiveAllowed) {
          return state.isProd
            ? stringifyScreen(state.config, mod)
            : '__computed__' +
                state.tailwindUtilsIdentifier.name +
                '.stringifyScreen(' +
                state.tailwindConfigIdentifier.name +
                ', "' +
                mod +
                '")'
        }
      }
      if (validModifiers.includes(mod)) {
        return `:${mod}`
      }

      throw new Error(
        `\n\nThe variant "${mod}" is unavailable.\n\nAvailable variants:\n${validModifiers
          .map(i => `${i}:`)
          .join(`${chalk.hex('#a0aec0')(',')} `)}\n\n`
      )
    })
    .filter(Boolean)
}

export default function getStyles(str, t, state) {
  const styles = (str.match(/\S+/g) || []).reduce(
    (acc, classNameRaw, index) => {
      // Exit early
      if (classNameRaw.endsWith('-')) {
        return showError(classNameRaw)
      }

      // Extract the modifiers
      const { className, modifiers } = splitVariants(classNameRaw)

      const hasNegativeValue = className.slice(0, 1) === '-'

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
        return showError(className)
      }

      // Match the filtered modifiers
      const matchedVariants = validateVariants({
        modifiers,
        state
      })

      if (staticStyleKey) {
        const staticStyleOutput = dlv(staticStyles, [className, 'output'])
        if (!staticStyleOutput) {
          throw new Error(
            `No output value found for ${className} in static config`
          )
        }

        const mergedStaticOutput = mergeVariants({
          variants: matchedVariants,
          objBase: acc,
          objToMerge: staticStyleOutput
        })

        state.debug &&
          console.log(
            `${className} ${chalk.hex('#a0aec0')('>')} ${JSON.stringify(
              staticStyleOutput
            )}`
          )

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
            prefix: hasNegativeValue ? '-' : ''
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

      const mergedDynamicOutput = mergeVariants({
        variants: matchedVariants,
        objBase: acc,
        objToMerge: results
      })

      state.debug &&
        console.log(
          `${className} ${chalk.hex('#a0aec0')('>')} ${JSON.stringify(results)}`
        )

      return mergedDynamicOutput
    },
    {}
  )

  const ast = state.isDev ? assignify(ast, t) : astify(styles, t)
  return ast
}
