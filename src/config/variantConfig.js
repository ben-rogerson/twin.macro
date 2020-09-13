/**
 * Pseudo-classes (Variants)
 * In Twin, these are always available on just about any class
 *
 * See MDN web docs for more information
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 */

export default {
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

  // Group states
  // You'll need to add className="group" to an ancestor to make these work
  // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
  'group-hover': variantData =>
    generateGroupSelector('.group:hover &', variantData), // Tailwind
  'group-focus': variantData =>
    generateGroupSelector('.group:focus &', variantData), // Tailwind
  'group-hocus': variantData =>
    generateGroupSelector('.group:hover &, .group:focus &', variantData),
  'group-active': variantData =>
    generateGroupSelector('.group:active &', variantData),
  'group-visited': variantData =>
    generateGroupSelector('.group:visited &', variantData),

  // Motion control
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  'motion-safe': '@media (prefers-reduced-motion: no-preference)',
  'motion-reduce': '@media (prefers-reduced-motion: reduce)',

  // Dark theme
  dark: ({ hasGroupVariant, config, errorCustom }) => {
    const styles =
      {
        // Media strategy: The default when you prepend with dark, tw`dark:block`
        media: '@media (prefers-color-scheme: dark)',
        // Class strategy: In your tailwind.config.js, add `{ dark: 'class' }
        // then add a `className="dark"` on a parent element.
        class: !hasGroupVariant && '.dark &',
      }[config('dark') || 'media'] || null

    if (!styles && !hasGroupVariant) {
      errorCustom(
        "The `dark` config option must be either `{ dark: 'media' }` (default) or `{ dark: 'class' }`"
      )
    }

    return styles
  },

  // Light theme
  light: ({ hasGroupVariant, config, errorCustom }) => {
    const styles =
      {
        // Media strategy: The default when you prepend with light, tw`light:block`
        media: '@media (prefers-color-scheme: light)',
        // Class strategy: In your tailwind.config.js, add `{ light: 'class' }
        // then add a `className="light"` on a parent element.
        class: !hasGroupVariant && '.light &',
      }[config('light') || config('dark') || 'media'] || null

    if (!styles && !hasGroupVariant) {
      if (config('light')) {
        errorCustom(
          "The `light` config option must be either `{ light: 'media' }` (default) or `{ light: 'class' }`"
        )
      }

      errorCustom(
        "The `dark` config option must be either `{ dark: 'media' }` (default) or `{ dark: 'class' }`"
      )
    }

    return styles
  },
}

const generateGroupSelector = (
  className,
  { hasDarkVariant, hasLightVariant, config }
) => {
  const themeVariant =
    (hasDarkVariant && config('dark') === 'class' && ['dark ', 'dark']) ||
    (hasLightVariant &&
      (config('light') === 'class' || config('dark') === 'class') && [
        'light ',
        'light',
      ])
  return themeVariant
    ? themeVariant
        .map(v =>
          className
            .split(', ')
            .map(cn => `.${v}${cn}`)
            .join(', ')
        )
        .join(', ')
    : className
}
