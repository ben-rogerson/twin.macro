import dset from 'dset'
import dlv from 'dlv'
import { stringifyScreen } from './screens'
import { logNoVariant } from './logging'
import { MacroError } from 'babel-plugin-macros'
import { COMPUTED_ID } from './macroHelpers'

const modifierList = {
  'group-hover': '.group:hover &',
  'focus-within': ':focus-within',
  first: ':first-child',
  last: ':last-child',
  odd: ':nth-child(odd)',
  even: ':nth-child(even)',
  hover: ':hover',
  focus: ':focus',
  active: ':active',
  visited: ':visited',
  disabled: ':disabled',
  // Custom to Twin
  'group-hocus': '.group:hover &, .group:focus &',
  'group-focus': '.group:focus &',
  'group-active': '.group:active &',
  'group-visited': '.group:visited &',
  hocus: ':hover, :focus',
  before: ':before',
  after: ':after',
}

/**
 * Merge the modifiers
 */
const mergeVariants = ({ variants, objBase, objToMerge }) => {
  if (!objToMerge) return objBase
  if (variants.length === 0) {
    return {
      ...objBase,
      ...objToMerge,
    }
  }

  // TODO: Replace dset
  dset(objBase, variants, {
    ...dlv(objBase, variants, {}),
    ...objToMerge,
  })
  return objBase
}

/**
 * Validate modifiers against the variants config key
 */
const validateVariants = ({ modifiers, state }) => {
  if (!modifiers) return []

  const themeScreens = dlv(state.config, ['theme', 'screens'])
  const themeScreenKeys = Object.keys(themeScreens)
  const validModifiers = [...Object.keys(modifierList), ...themeScreenKeys]

  return modifiers
    .map(modifier => {
      const isModifierResponsive =
        themeScreenKeys && themeScreenKeys.includes(modifier)
      if (isModifierResponsive) {
        return state.isProd
          ? stringifyScreen(state.config, modifier)
          : `${COMPUTED_ID}${state.tailwindUtilsIdentifier.name}.stringifyScreen(${state.tailwindConfigIdentifier.name}, "${modifier}")`
      }

      // Check modifier against available modifiers
      if (modifierList[modifier]) {
        return modifierList[modifier]
      }

      throw new MacroError(logNoVariant(modifier, validModifiers))
    })
    .filter(Boolean)
}

/**
 * Split the variant(s) from the className
 */
const splitVariants = ({ className, ...rest }) => {
  const modifiers = []
  let modifier
  while (modifier !== null) {
    modifier = className.match(/^([_a-z-]+):/)
    if (modifier) {
      className = className.slice(modifier[0].length)
      modifiers.push(modifier[1])
    }
  }

  return { ...rest, className, modifiers }
}

export { splitVariants, mergeVariants, validateVariants }
