// Used for tests (see '/__fixtures__/-plugins.js')
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
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.type-sm': {
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.tight')
        }
      }
      addUtilities(newUtilities)
    }
  ]
}
