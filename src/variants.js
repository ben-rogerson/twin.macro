import dset from 'dset'
import dlv from 'dlv'
import { stringifyScreen } from './screens'
import { logNoVariant } from './logging'
import { MacroError } from 'babel-plugin-macros'

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
    'group-hover',
    'group-hocus',
    'group-focus',
    'group-active',
    'group-visited',
    'focus-within',
    'first',
    'last',
    'odd',
    'even',
    'hover',
    'focus',
    'active',
    'visited',
    'disabled',
    // Custom variants
    'hocus',
    'before',
    'after'
  ]
  const themeScreens = dlv(state.config, ['theme', 'screens'])
  const themeScreenKeys = Object.keys(themeScreens)
  const validModifiers = [...availableModifiers, ...themeScreenKeys]

  return modifiers
    .map(mod => {
      if (mod === 'group-hover') {
        return '.group:hover &'
      }
      if (mod === 'group-hocus') {
        return '.group:hover &, .group:focus &'
      }
      if (mod === 'group-focus') {
        return '.group:focus &'
      }
      if (mod === 'group-active') {
        return '.group:active &'
      }
      if (mod === 'group-visited') {
        return '.group:visited &'
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
      if (mod === 'hocus') {
        return ':hover, :focus'
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

      throw new MacroError(logNoVariant(mod, validModifiers))
    })
    .filter(Boolean)
}

/**
 * Split the variant(s) from the className
 */
const splitVariants = ({ className, ...rest }) => {
  let modifiers = []
  let modifier
  while (modifier !== null) {
    modifier = className.match(/^([a-z-_]+):/i)
    if (modifier) {
      className = className.substr(modifier[0].length)
      modifiers.push(modifier[1])
    }
  }
  return { ...rest, className, modifiers }
}

export { splitVariants, mergeVariants, validateVariants }
