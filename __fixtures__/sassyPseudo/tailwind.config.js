const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(({ addComponents }) =>
      addComponents({
        '.my-class1': {
          '&:hover': {
            backgroundColor: 'pink',
          },
        },
        '.my-class2': {
          ':hover': {
            backgroundColor: 'orange',
          },
        },
        '.my-class3': {
          '.test & :hover': {
            backgroundColor: 'orange',
          },
        },
      })
    ),
  ],
}
