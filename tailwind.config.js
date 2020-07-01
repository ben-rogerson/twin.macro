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
    fluidContainer: {
      default: '10%',
      small: '25%',
      large: '75%',
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
  plugins: [
    addUtilitiesTest,
    addUtilitiesTest2,
    addComponentsTest,
    fluidContainer,
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

function fluidContainer({ addComponents, theme }) {
  const styles = [
    {
      '.fluid-container': {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: theme('fluidContainer.default', '100%'),
      },
    },
    {
      '.fluid-container:focus': {
        marginLeft: '10rem',
        marginRight: '11rem',
        width: theme('fluidContainer.default', '100%'),
      },
    },
    {
      '.not-container': {
        content: 'not-container',
      },
    },
    {
      '@media (min-width: 1440px)': {
        '.fluid-container': {
          display: 'block',
        },
      },
    },
    {
      '@media (min-width: 768px)': {
        '.fluid-container:hover': {
          width: theme('fluidContainer.small', '100%'),
        },
        '.not-fluid-container': {
          content: 'not-fluid-container:focus',
        },
        '.fluid-container:focus': {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: theme('fluidContainer.default', '100%'),
        },
      },
    },
    {
      '.fluid-container': {
        '@media (min-width: 1440px)': {
          width: theme('fluidContainer.large', '100%'),
          backgroundColor: 'black',
        },
        '@media only screen and (max-width: 540px)': {
          width: '33%',
          backgroundColor: 'red',
        },
      },
    },
  ]

  addComponents(styles)
}
