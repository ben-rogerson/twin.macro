// Used for tests (see '/__fixtures__/-plugins.js')
module.exports = {
  theme: {
    container: {
      padding: {
        default: ['1rem', '2rem'],
        sm: ['2rem'],
        lg: '4rem',
        xl: '6rem',
      },
      margin: {
        default: ['2rem', '3rem'],
        sm: ['auto'],
        lg: '5rem',
        xl: '7rem',
      },
    },
    extend: {
      colors: {
        number: 0,
        'purple-hyphen': 'purple',
        mycolors: {
          default: 'blue',
          'a-purple': 'purple',
          'a-number': 0,
          array: ['blue', 'purple', 'orange'],
        },
      },
      fontWeight: {
        customFontWeightAsString: '700',
        // Tailwind accepts numbers in configuration as well
        // https://tailwindcss.com/docs/font-weight#font-weights
        customFontWeightAsNumber: 800,
      },
    },
  },
  plugins: [addUtilitiesTest, addUtilitiesTest2, addComponentsTest],
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
