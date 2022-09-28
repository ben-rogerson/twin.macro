module.exports = {
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
    extend: {
      screens: {
        object: { min: '968px' },
        'object-width': { 'min-width': '992px' },
        'object-min-max': { min: '1200px', max: '1600px' },
      },
    },
  },
}
