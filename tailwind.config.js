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

const animations = {
  animation: {
    none: 'none',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
  },
  keyframes: {
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    ping: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '75%, 100%': { transform: 'scale(2)', opacity: '0' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '.5' },
    },
    bounce: {
      '0%, 100%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
      },
      '50%': {
        transform: 'translateY(0)',
        animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
      },
    },
  },
}

module.exports = {
  theme: {
    ...animations,
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
    textStyles,
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
        'my-blue': {
          100: 'blue',
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
    },
  },
  plugins: [
    addUtilitiesTest,
    addUtilitiesTest2,
    addComponentsTest,
    fluidContainer,
    addComponentsTestElementPrefixes,
    addComponentsTestElementScreenReplacements,
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
