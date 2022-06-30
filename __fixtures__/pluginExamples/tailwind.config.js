// https://tailwindcss.com/docs/plugins
const plugin = require('tailwindcss/plugin')

const addUtilities = function ({ addUtilities }) {
  addUtilities({
    '.content-auto': {
      'content-visibility': 'auto',
    },
    '.content-hidden': {
      'content-visibility': 'hidden',
    },
    '.content-visible': {
      'content-visibility': 'visible',
    },
  })
}

const defaultValues = plugin(
  function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        tab: value => ({
          tabSizeTest: value,
        }),
      },
      { values: theme('tabSizeTest') }
    )
  },
  {
    theme: {
      tabSizeTest: {
        1: '1',
        2: '2',
        4: '4',
        8: '8',
      },
    },
  }
)

const addComponents = function ({ addComponents }) {
  addComponents({
    '.btn': {
      padding: '.5rem 1rem',
      borderRadius: '.25rem',
      fontWeight: '600',
    },
    '.btn-blue': {
      backgroundColor: '#3490dc',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#2779bd',
      },
    },
    '.btn-red': {
      backgroundColor: '#e3342f',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#cc1f1a',
      },
    },
  })
}

const addBase = function ({ addBase, theme }) {
  addBase({
    h1: { fontSize: theme('fontSize.2xl') },
    h2: { fontSize: theme('fontSize.xl') },
    h3: { fontSize: theme('fontSize.lg') },
  })
}

const addVariant = function ({ addVariant }) {
  addVariant('test-1', '&:test1')
  addVariant('test-2', ['&:hover', '&:focus'])
  addVariant('test-3', '@supports (display: grid)')
  addVariant('test-4', 'html.dark &.something')
}

// https://github.com/tailwindlabs/tailwindcss/blob/master/tests/match-variants.test.js
// const matchVariant = ({ matchVariant }) => {
//   matchVariant({
//     potato: flavor => `.potato-${flavor} &`,
//     carrot: flavor => `@media (carrot: ${flavor})`,
//     beetroot: flavor => `@media (beetroot: ${flavor}) { &:beetroot }`,
//   })
//   matchVariant(
//     {
//       tooltip: side => `&${side}`,
//     },
//     {
//       values: {
//         bottom: '[data-location="bottom"]',
//         top: '[data-location="top"]',
//       },
//     }
//   )
//   matchVariant(
//     {
//       alphabet: side => `&${side}`,
//     },
//     {
//       values: {
//         a: '[data-value="a"]',
//         b: '[data-value="b"]',
//         c: '[data-value="c"]',
//         d: '[data-value="d"]',
//       },
//     }
//   )
//   matchVariant({
//     test: selector => selector.split(',').map(selector => `&.${selector} > *`),
//   })
// }

module.exports = {
  corePlugins: { preflight: false },
  plugins: [
    addUtilities,
    defaultValues,
    addComponents,
    addBase,
    addVariant,
    // matchVariant,
  ],
}
