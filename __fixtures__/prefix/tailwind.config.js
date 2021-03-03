const plugin = require('tailwindcss/plugin')

function pluginClass({ addComponents }) {
  addComponents([
    {
      '.plugin-class': {
        content: 'working',
      },
    },
  ])
}

// Test a couple extra things
const parentTestPlugin = plugin(({ addUtilities }) => {
  addUtilities({
    '.test-1': {
      background: '5px',
      '.a-class & .some-class': {
        margin: '10px',
      },
      '.a-class & > *': {
        margin: '20px',
      },
    },
    '.test-2': {
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
  prefix: 'tw-',
  plugins: [pluginClass, parentTestPlugin],
}
