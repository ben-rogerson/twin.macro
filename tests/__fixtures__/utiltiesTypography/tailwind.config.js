module.exports = {
  theme: {
    extend: {
      // https://tailwindcss.com/docs/font-size#providing-a-default-line-height
      fontSize: {
        '2xl': [
          '24px',
          {
            letterSpacing: '-0.01em',
          },
        ],
        // Or with a default line-height as well
        '3xl': [
          '32px',
          {
            letterSpacing: '-0.02em',
            lineHeight: '40px',
          },
        ],
      },
      fontFamily: {
        custom: [
          'Inter var, sans-serif',
          {
            fontFeatureSettings: '"cv11", "ss01"',
            fontVariationSettings: '"opsz" 32',
          },
        ],
      },
      colors: {
        'red-500/fromConfig': '#000',
        electric: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(219, 0, 255, ${opacityValue})`
          }

          if (opacityVariable !== undefined) {
            return `rgba(219, 0, 255, var(${opacityVariable}, 1))`
          }

          return `rgb(219, 0, 255)`
        },
      },
    },
  },
}
