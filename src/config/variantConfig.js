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
  placeholder: '::placeholder',
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

  // Media types
  print: '@media print',
  screen: '@media screen',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  'motion-safe': '@media (prefers-reduced-motion: no-preference)',
  'motion-reduce': '@media (prefers-reduced-motion: reduce)',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
  'any-pointer-none': '@media (any-pointer: none)',
  'any-pointer-fine': '@media (any-pointer: fine)',
  'any-poiner-coarse': '@media (any-pointer: coarse)',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
  'poiner-none': '@media (pointer: none)',
  'poiner-fine': '@media (pointer: fine)',
  'poiner-coarse': '@media (pointer: coarse)',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover
  'any-hover-none': '@media (any-hover: none)',
  'any-hover': '@media (any-hover: hover)',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
  'can-hover': '@media (hover: hover)',
  'cant-hover': '@media (hover: none)',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',

  // Dark mode
  dark: variantDarkMode,

  // Light mode
  light: variantLightMode,
})

export default variantConfig
