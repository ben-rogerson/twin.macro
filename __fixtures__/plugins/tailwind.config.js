module.exports = {
  theme: {
    aspectRatio: {
      2: '2',
      4: '4',
      6: '6',
    },
  },
  plugins: [
    addUtilitiesTest,
    addUtilitiesTest2,
    addComponentsTest,
    addComponentsTestElementPrefixes,
    addComponentsTestElementScreenReplacements,
    pluginBaseSelectors,
  ],
}

function addUtilitiesTest({ addUtilities, theme }) {
  const newUtilities = {
    '.type-sm': {
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('lineHeight.tight'),
    },
  }
  addUtilities(newUtilities)
}

function addUtilitiesTest2({ addUtilities }) {
  const newUtilities = {
    '.skew-10deg': {
      transform: 'skewY(-10deg)',
    },
    '.skew-15deg': {
      transform: 'skewY(-15deg)',
    },
  }

  addUtilities(newUtilities)
}

function addComponentsTest({ addComponents }) {
  const buttons = {
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
  }

  addComponents(buttons)
}

function addComponentsTestElementPrefixes({ addComponents }) {
  const styles = [
    {
      '.prefixes': {
        h1: {
          margin: 'auto',
          marginRight: '10px',
        },
        'h2:hover': {
          color: 'red',
        },
        'h3:hover, h3:active': {
          color: 'green',
        },
        ':focus': {
          display: 'none',
        },
      },
    },
  ]

  addComponents(styles)
}

function addComponentsTestElementScreenReplacements({ addComponents }) {
  const styles = [
    {
      '.screenies': {
        '@screen sm': {
          display: 'block',
        },
        '@screen lg': {
          display: 'inline-block',
        },
        '@screen md': {
          display: 'flex',
        },
        '@screen xl': {
          h1: {
            marginTop: '50px',
            '&:hover, &:focus': {
              color: 'blue',
            },
          },
        },
      },
    },
  ]

  addComponents(styles)
}

// tests introducing a config item and using the items as base selectors
function pluginBaseSelectors({ addComponents, theme, e }) {
  const values = theme('aspectRatio')

  const baseSelectors = Object.entries(values)
    .map(([key]) => `.${e(`aspect-test-${key}`)}`)
    .join(',\n')

  addComponents([{ [baseSelectors]: { content: 'test' } }])
}
