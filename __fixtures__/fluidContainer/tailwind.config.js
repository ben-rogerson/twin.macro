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

module.exports = {
  theme: {
    fluidContainer: {
      DEFAULT: '10%',
      small: '25%',
      large: '75%',
    },
  },
  plugins: [fluidContainer],
}
