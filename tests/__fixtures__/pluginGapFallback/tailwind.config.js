const plugin = require('tailwindcss/plugin')

const half = value => value.replace(/\d+(.\d+)?/, number => number / 2)

// Basic plugin that creates new gap classes
const gapReplacementPlugin = plugin(({ addUtilities, e, theme }) => {
  Object.entries(theme('gap')).forEach(([key, value]) =>
    addUtilities({
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
    })
  )
})

// Alternative gap plugin that uses a parent class that's dynamically added
const gapSupportPlugin = plugin(({ addUtilities, e, theme }) => {
  Object.entries(theme('gap')).forEach(([key, value]) =>
    addUtilities({
      [`.gap-${e(key)}`]: {
        '.no-flex-gap &': {
          margin: `-${half(value)}`,
        },
        '.no-flex-gap & > *': {
          margin: half(value),
        },
      },
      [`.gap-x-${e(key)}`]: {
        '.no-flex-gap &': {
          marginRight: `-${half(value)}`,
          marginLeft: `-${half(value)}`,
        },
        '.no-flex-gap & > *': {
          marginRight: half(value),
          marginLeft: half(value),
        },
      },
      [`.gap-y-${e(key)}`]: {
        '.no-flex-gap &': {
          marginTop: `-${half(value)}`,
          marginBottom: `-${half(value)}`,
        },
        '.no-flex-gap & > *': {
          marginTop: half(value),
          marginBottom: half(value),
        },
      },
    })
  )
})

// Test a couple extra things
const testPlugin = plugin(({ addUtilities, e, theme }) => {
  addUtilities({
    [`.test-1`]: {
      background: '5px',
      '.a-class & .some-class': {
        margin: '10px',
      },
      '.a-class & > *': {
        margin: '20px',
      },
    },
    [`.test-2`]: {
      '.a-class & .some-class': {
        margin: '10px',
      },
      '.a-class & > *': {
        margin: '20px',
      },
    },
  })
})

module.exports = {
  plugins: [gapReplacementPlugin, gapSupportPlugin, testPlugin],
}
