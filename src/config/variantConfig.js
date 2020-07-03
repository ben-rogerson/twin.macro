/**
 * Pseudo-classes (Variants)
 * In Twin, these are always available on just about any class
 *
 * See MDN web docs for more information
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 */

export default {
  /**
   * Tailwind default variants
   */
  hover: ':hover',
  focus: ':focus',
  active: ':active',
  visited: ':visited',
  disabled: ':disabled',
  first: ':first-child',
  last: ':last-child',
  odd: ':nth-child(odd)',
  even: ':nth-child(even)',
  // Group states
  // Add className="group" to an ancestor and add these on the children
  // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
  'group-hover': '.group:hover &',
  'group-focus': '.group:focus &',
  'focus-within': ':focus-within',

  /**
   * Twin variants
   */

  // Before/after pseudo elements
  // Usage: tw`before:content before:bg-black`
  before: ':before',
  after: ':after',

  // Of-type
  'first-of-type': ':first-of-type',
  'last-of-type': ':last-of-type',
  'odd-of-type': ':nth-of-type(odd)',
  'even-of-type': ':nth-of-type(even)',

  // Interactive links/buttons
  hocus: ':hover, :focus',
  link: ':link',
  target: ':target',
  'focus-visible': ':focus-visible',

  // Form element states
  checked: ':checked',
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

  // Not things
  'not-first': ':not(:first-child)',
  'not-last': ':not(:last-child)',
  'not-only-child': ':not(:only-child)',
  'not-first-of-type': ':not(:first-of-type)',
  'not-last-of-type': ':not(:last-of-type)',
  'not-only-of-type': ':not(:only-of-type)',

  // Only things
  'only-child': ':only-child',
  'only-of-type': ':only-of-type',

  // Group states
  // Add className="group" to an ancestor and add these on the children
  // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
  'group-hocus': '.group:hover &, .group:focus &',
  'group-active': '.group:active &',
  'group-visited': '.group:visited &',
}
