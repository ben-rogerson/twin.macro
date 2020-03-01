// Used for tests (see '/__fixtures__/-plugins.js')
module.exports = {
  theme: {
    extend: {}
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
