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
  createPeer,
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
  'group-hover': data => prefixDarkLightModeClass('.group:hover &', data), // Tailwind
  'group-focus': data => prefixDarkLightModeClass('.group:focus &', data), // Tailwind
  'group-hocus': data =>
    prefixDarkLightModeClass('.group:hover &, .group:focus &', data),
  'group-active': data => prefixDarkLightModeClass('.group:active &', data),
  'group-visited': data => prefixDarkLightModeClass('.group:visited &', data),

  // Media types
  print: '@media print',
  screen: '@media screen',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  'motion-safe': '@media (prefers-reduced-motion: no-preference)',
  'motion-reduce': '@media (prefers-reduced-motion: reduce)',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
  'any-pointer-none': '@media (any-pointer: none)',
  'any-pointer-fine': '@media (any-pointer: fine)',
  'any-pointer-coarse': '@media (any-pointer: coarse)',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
  'pointer-none': '@media (pointer: none)',
  'pointer-fine': '@media (pointer: fine)',
  'pointer-coarse': '@media (pointer: coarse)',

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

  // Peer variants
  'peer-first': createPeer('first-child'),
  'peer-last': createPeer('last-child'),
  'peer-only': createPeer('only-child'),
  'peer-even': createPeer('nth-child(even)'),
  'peer-odd': createPeer('nth-child(odd)'),
  'peer-first-of-type': createPeer('first-of-type'),
  'peer-last-of-type': createPeer('last-of-type'),
  'peer-only-of-type': createPeer('only-of-type'),
  'peer-hover': createPeer('hover'),
  'peer-focus': createPeer('focus'),
  'peer-disabled': createPeer('disabled'),
  'peer-active': createPeer('active'),
  'peer-target': createPeer('target'),
  'peer-visited': createPeer('visited'),
  'peer-default': createPeer('default'),
  'peer-checked': createPeer('checked'),
  'peer-indeterminate': createPeer('indeterminate'),
  'peer-placeholder-shown': createPeer('placeholder-shown'),
  'peer-autofill': createPeer('autofill'),
  'peer-focus-within': createPeer('focus-within'),
  'peer-focus-visible': createPeer('focus-visible'),
  'peer-required': createPeer('required'),
  'peer-valid': createPeer('valid'),
  'peer-invalid': createPeer('invalid'),
  'peer-in-range': createPeer('in-range'),
  'peer-out-of-range': createPeer('out-of-range'),
  'peer-read-only': createPeer('read-only'),
  'peer-empty': createPeer('empty'),
})

export default variantConfig
