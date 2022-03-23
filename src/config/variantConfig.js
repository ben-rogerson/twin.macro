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
  // Usage: tw`before:(block w-10 h-10 bg-black)`
  before: ':before',
  after: ':after',

  // Interactive links/buttons
  hover: ':hover',
  focus: ':focus',
  active: ':active',
  visited: ':visited',
  hocus: ':hover, :focus',
  link: ':link',
  target: ':target',
  'focus-visible': ':focus-visible',
  'focus-within': ':focus-within',

  // Form elements
  file: '::file-selector-button',

  // Form element states
  autofill: ':autofill',
  disabled: ':disabled',
  checked: ':checked',
  'not-checked': ':not(:checked)',
  default: ':default',
  enabled: ':enabled',
  indeterminate: ':indeterminate',
  'in-range': ':in-range',
  invalid: ':invalid',
  valid: ':valid',
  optional: ':optional',
  'out-of-range': ':out-of-range',
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
  'first-letter': '::first-letter',
  'first-line': '::first-line',
  first: ':first-child',
  'not-first': ':not(:first-child)',
  last: ':last-child',
  'not-last': ':not(:last-child)',
  only: ':only-child',
  'not-only': ':not(:only-child)',
  'only-of-type': ':only-of-type',
  'not-only-of-type': ':not(:only-of-type)',
  even: ':nth-child(even)',
  odd: ':nth-child(odd)',
  'even-of-type': ':nth-of-type(even)',
  'odd-of-type': ':nth-of-type(odd)',
  svg: 'svg',
  all: '*',
  'all-child': '> *',
  sibling: '~ *',

  // Content
  empty: ':empty',

  // Group states
  // You'll need to add className="group" to an ancestor to make these work
  // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
  'group-hocus': variantData =>
    prefixDarkLightModeClass('.group:hover &, .group:focus &', variantData),
  'group-first': variantData =>
    prefixDarkLightModeClass('.group:first-child &', variantData),
  'group-last': variantData =>
    prefixDarkLightModeClass('.group:last-child &', variantData),
  'group-only': variantData =>
    prefixDarkLightModeClass('.group:only-child &', variantData),
  'group-even': variantData =>
    prefixDarkLightModeClass('.group:nth-child(even) &', variantData),
  'group-odd': variantData =>
    prefixDarkLightModeClass('.group:nth-child(odd) &', variantData),
  'group-first-of-type': variantData =>
    prefixDarkLightModeClass('.group:first-of-type &', variantData),
  'group-last-of-type': variantData =>
    prefixDarkLightModeClass('.group:last-of-type &', variantData),
  'group-only-of-type': variantData =>
    prefixDarkLightModeClass('.group:not(:first-of-type) &', variantData),
  'group-hover': variantData =>
    prefixDarkLightModeClass('.group:hover &', variantData),
  'group-focus': variantData =>
    prefixDarkLightModeClass('.group:focus &', variantData),
  'group-disabled': variantData =>
    prefixDarkLightModeClass('.group:disabled &', variantData),
  'group-active': variantData =>
    prefixDarkLightModeClass('.group:active &', variantData),
  'group-target': variantData =>
    prefixDarkLightModeClass('.group:target &', variantData),
  'group-visited': variantData =>
    prefixDarkLightModeClass('.group:visited &', variantData),
  'group-default': variantData =>
    prefixDarkLightModeClass('.group:default &', variantData),
  'group-checked': variantData =>
    prefixDarkLightModeClass('.group:checked &', variantData),
  'group-indeterminate': variantData =>
    prefixDarkLightModeClass('.group:indeterminate &', variantData),
  'group-placeholder-shown': variantData =>
    prefixDarkLightModeClass('.group:placeholder-shown &', variantData),
  'group-autofill': variantData =>
    prefixDarkLightModeClass('.group:autofill &', variantData),
  'group-focus-within': variantData =>
    prefixDarkLightModeClass('.group:focus-within &', variantData),
  'group-focus-visible': variantData =>
    prefixDarkLightModeClass('.group:focus-visible &', variantData),
  'group-required': variantData =>
    prefixDarkLightModeClass('.group:required &', variantData),
  'group-valid': variantData =>
    prefixDarkLightModeClass('.group:valid &', variantData),
  'group-invalid': variantData =>
    prefixDarkLightModeClass('.group:invalid &', variantData),
  'group-in-range': variantData =>
    prefixDarkLightModeClass('.group:in-range &', variantData),
  'group-out-of-range': variantData =>
    prefixDarkLightModeClass('.group:out-of-range &', variantData),
  'group-read-only': variantData =>
    prefixDarkLightModeClass('.group:read-only &', variantData),
  'group-empty': variantData =>
    prefixDarkLightModeClass('.group:empty &', variantData),

  // Media types
  print: '@media print',
  screen: '@media screen',

  // Direction variants
  rtl: '[dir="rtl"] &',
  ltr: '[dir="ltr"] &',

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

  // Dark mode / Light mode
  dark: variantDarkMode,
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

  // Selection
  selection: '::selection',

  // Lists
  marker: '::marker, *::marker',
})

export default variantConfig
