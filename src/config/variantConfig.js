/**
 * Pseudo-classes (Variants)
 * In Twin, these are always available on just about any class
 *
 * See MDN web docs for more information
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 */

const variantConfig = ({
  variantDarkMode,
  variantLightMode,
  prefixDarkLightModeClass,
}) => ({
  // Before/after pseudo elements
  // Usage: tw`before:(content block w-10 h-10 bg-black)`
  before: ':before',
  after: ':after',

  // Interactive links/buttons
  hover: ':hover', // Tailwind
  focus: ':focus', // Tailwind
  active: ':active', // Tailwind
  visited: ':visited', // Tailwind
  hocus: ':hover, :focus',
  link: ':link',
  target: ':target',
  'focus-visible': ':focus-visible', // Tailwind
  'focus-within': ':focus-within', // Tailwind

  // Form element states
  disabled: ':disabled', // Tailwind
  checked: ':checked', // Tailwind
  'not-checked': ':not(:checked)',
  default: ':default',
  enabled: ':enabled',
  indeterminate: ':indeterminate',
  invalid: ':invalid',
  valid: ':valid',
  optional: ':optional',
  required: ':required',
  'placeholder-shown': ':placeholder-shown',
  'read-only': ':read-only',
  'read-write': ':read-write',

  // Child selectors
  'not-disabled': ':not(:disabled)',
  'first-of-type': ':first-of-type',
  'not-first-of-type': ':not(:first-of-type)',
  'last-of-type': ':last-of-type',
  'not-last-of-type': ':not(:last-of-type)',
  first: ':first-child', // Tailwind
  'not-first': ':not(:first-child)',
  last: ':last-child', // Tailwind
  'not-last': ':not(:last-child)',
  'only-child': ':only-child',
  'not-only-child': ':not(:only-child)',
  'only-of-type': ':only-of-type',
  'not-only-of-type': ':not(:only-of-type)',
  even: ':nth-child(even)', // Tailwind
  odd: ':nth-child(odd)', // Tailwind
  'even-of-type': ':nth-of-type(even)',
  'odd-of-type': ':nth-of-type(odd)',
  svg: 'svg',
  all: '*',
  'all-child': '> *',
  sibling: '~ *',

  // Group states
  // You'll need to add className="group" to an ancestor to make these work
  // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
  'group-hover': variantData =>
    prefixDarkLightModeClass('.group:hover &', variantData), // Tailwind
  'group-focus': variantData =>
    prefixDarkLightModeClass('.group:focus &', variantData), // Tailwind
  'group-hocus': variantData =>
    prefixDarkLightModeClass('.group:hover &, .group:focus &', variantData),
  'group-active': variantData =>
    prefixDarkLightModeClass('.group:active &', variantData),
  'group-visited': variantData =>
    prefixDarkLightModeClass('.group:visited &', variantData),

  // Motion control
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  'motion-safe': '@media (prefers-reduced-motion: no-preference)',
  'motion-reduce': '@media (prefers-reduced-motion: reduce)',

  // Dark mode
  dark: variantDarkMode,

  // Light mode
  light: variantLightMode,
})

export default variantConfig
