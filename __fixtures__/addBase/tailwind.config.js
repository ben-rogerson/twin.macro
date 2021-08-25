function addBasePlugin({ addBase }) {
  const baseStyles = {
    ':root': {
      '--color-pink-900': '#831843',
    },
    body: {
      marginTop: '20rem',
      backgroundColor: 'black',
    },
    '.base-selector': {
      display: 'block',
    },
    'section .base-selector': {
      display: 'block',
      '@screen sm': {
        '&:hover': {
          marginTop: '50px',
        },
      },
    },
    '[type="button"] .base-selector': {
      display: 'block',
      '@screen sm': {
        '&:hover': {
          marginTop: '5rem',
        },
      },
    },
  }
  addBase(baseStyles)
}

module.exports = {
  plugins: [addBasePlugin],
}
