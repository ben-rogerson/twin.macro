export default {
  // Tailwind
  'group-hover': '.group:hover &',
  'group-focus': '.group:focus &',
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

  // Twin
  before: ':before',
  after: ':after',
  hocus: ':hover, :focus',
  checked: ':checked',
  // 'group' - add this within a className
  'group-hocus': '.group:hover &, .group:focus &',
  'group-active': '.group:active &',
  'group-visited': '.group:visited &',
}
