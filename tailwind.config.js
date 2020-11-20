/* eslint-disable @typescript-eslint/no-var-requires */
// Used for tests (see '/__fixtures__/-plugins.js')

const textStyles = theme => ({
  heading: {
    output: false,
    fontWeight: theme('fontWeight.bold'),
    lineHeight: theme('lineHeight.tight'),
  },
  h1: {
    extends: 'heading',
    fontSize: theme('fontSize.5xl'),
    '@screen sm': {
      fontSize: theme('fontSize.6xl'),
    },
  },
  h2: {
    extends: 'heading',
    fontSize: theme('fontSize.4xl'),
    '@screen sm': {
      fontSize: theme('fontSize.5xl'),
      lineHeight: '50px',
    },
  },
  '@screen sm': {
    h3: {
      extends: 'heading',
      fontSize: theme('fontSize.4xl'),
    },
    ':hover': {
      color: theme('colors.blue.300'),
    },
  },
  link: {
    fontWeight: theme('fontWeight.bold'),
    color: theme('colors.blue.400'),
    '&:hover, &:focus': {
      color: theme('colors.blue.600'),
      textDecoration: 'underline',
    },
    '&:active': {
      color: theme('colors.orange.600'),
    },
  },
  richText: {
    fontWeight: theme('fontWeight.normal'),
    fontSize: theme('fontSize.base'),
    lineHeight: theme('lineHeight.relaxed'),
    '> * + *': {
      marginTop: '1em',
    },
    h1: {
      extends: 'h1',
    },
    a: {
      extends: 'link',
    },
    'b, strong': {
      fontWeight: theme('fontWeight.bold'),
    },
    'i, em': {
      fontStyle: 'italic',
    },
  },
})

module.exports = {
  dark: 'class',
  theme: {
    container: {
      padding: {
        DEFAULT: ['1rem', '2rem'],
        sm: ['2rem'],
        lg: '4rem',
        xl: '6rem',
        object: '8rem',
        'object-width': '10rem',
        'object-min-max': '12rem',
      },
      margin: {
        DEFAULT: ['2rem', '3rem'],
        sm: ['auto'],
        lg: '5rem',
        xl: '7rem',
      },
    },
    fluidContainer: {
      DEFAULT: '10%',
      small: '25%',
      large: '75%',
    },
    textStyles,
    extend: {
      screens: {
        object: { min: '968px' },
        'object-width': { 'min-width': '992px' },
        'object-min-max': { min: '1200px', max: '1600px' },
      },
      colors: {
        number: 0,
        'purple-hyphen': 'purple',
        mycolors: {
          DEFAULT: 'blue',
          'a-purple': 'purple',
          'a-number': 0,
          array: ['blue', 'purple', 'orange'],
        },
        'my-blue': {
          100: 'blue',
        },
        electric: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(219, 0, 255, ${opacityValue})`
          }

          if (opacityVariable !== undefined) {
            return `rgba(219, 0, 255, var(${opacityVariable}, 1))`
          }

          return `rgb(219, 0, 255)`
        },
        'color-opacity': ({ opacityVariable }) =>
          `rgba(var(--color-primary), var(${opacityVariable}, 1))`,
      },
      fontWeight: {
        customFontWeightAsString: '700',
        // Tailwind accepts numbers in configuration as well
        // https://tailwindcss.com/docs/font-weight#font-weights
        customFontWeightAsNumber: 800,
      },
      fontSize: {
        size: '24px',
        sizeLineHeight: ['24px', '15px'],
        sizeLineHeightLetterSpacing: [
          '32px',
          {
            lineHeight: '40px',
            letterSpacing: '-0.02em',
          },
        ],
      },
    },
  },
  plugins: [
    addUtilitiesTest,
    addUtilitiesTest2,
    addComponentsTest,
    fluidContainer,
    addComponentsTestElementPrefixes,
    addComponentsTestElementScreenReplacements,
    addComponentsTestCssVariableAsRuleProperty,
    require('@tailwindcss/typography'),
    require('tailwindcss-typography')({
      ellipsis: false,
      hyphens: false,
      kerning: false,
      textUnset: false,
      componentPrefix: '',
    }),
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
            color: 'red',
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

function addComponentsTestCssVariableAsRuleProperty({ addComponents }) {
  const styles = [
    {
      '.css-class-with-variable-as-rule-property': {
        '--some-css-variable-as-rule-prop': 'blue',
      },
    },
  ]

  addComponents(styles)
}
