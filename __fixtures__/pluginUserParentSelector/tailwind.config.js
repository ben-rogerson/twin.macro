const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(({ addComponents }) =>
      addComponents({
        '.my-class1': {
          backgroundColor: 'black',
          h2: {
            backgroundColor: 'red',
          },
        },
        '.my-class2': {
          backgroundColor: 'green',
          'h2 &': {
            backgroundColor: 'yellow',
          },
        },
        '.my-class3': {
          backgroundColor: 'green',
          '.dark &:hover': {
            backgroundColor: 'yellow',
          },
        },
        '.my-class4': {
          '.test & :hover': {
            backgroundColor: 'orange',
          },
        },
        '.my-class5': {
          backgroundColor: 'brown',
          '&:hover': {
            backgroundColor: 'pink',
          },
        },
        '.my-class6': {
          backgroundColor: 'blue',
          ':hover': {
            backgroundColor: 'orange',
          },
        },
      })
    ),
  ],
}
