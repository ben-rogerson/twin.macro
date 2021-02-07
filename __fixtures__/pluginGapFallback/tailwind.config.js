const plugin = require('tailwindcss/plugin')

function half(value) {
  return value.replace(/\d+(.\d+)?/, number => number / 2)
}

module.exports = {
  plugins: [
    plugin(({ addUtilities, e, theme, variants }) => {
      Object.entries(theme('gap')).forEach(([key, value]) =>
        addUtilities(
          {
            [`.flex-gap-${e(key)}`]: {
              margin: `-${half(value)}`,
              '& > *': {
                margin: half(value),
              },
            },
            [`.flex-gap-x-${e(key)}`]: {
              marginRight: `-${half(value)}`,
              marginLeft: `-${half(value)}`,
              '& > *': {
                marginRight: half(value),
                marginLeft: half(value),
              },
            },
            [`.flex-gap-y-${e(key)}`]: {
              marginTop: `-${half(value)}`,
              marginBottom: `-${half(value)}`,
              '& > *': {
                marginTop: half(value),
                marginBottom: half(value),
              },
            },
          },
          variants('gap')
        )
      )
    }),
  ],
}
