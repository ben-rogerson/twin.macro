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
  theme: {
    textStyles,
  },
  plugins: [
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
