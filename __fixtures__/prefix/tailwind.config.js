function pluginClass({ addComponents }) {
  addComponents([
    {
      '.plugin-class': {
        content: 'working',
      },
    },
  ])
}

module.exports = {
  prefix: 'tw-',
  plugins: [pluginClass],
}
