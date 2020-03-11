module.exports = {
  theme: {
    extend: {
      fontWeight: {
        customFontWeightAsString: '700',
        // Tailwind accepts numbers in configuration as well
        // https://tailwindcss.com/docs/font-weight#font-weights
        customFontWeightAsNumber: 800
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    ({ addComponents }) => {
      addComponents({
        '.content': {
          content: '""'
        },
        '.clearfix': {
          '::after': { content: '""', display: 'table', clear: 'both' }
        }
      })
    }
  ]
}
