module.exports = {
  theme: {
    extend: {
      // https://tailwindcss.com/docs/font-size#providing-a-default-line-height
      fontSize: {
        arraystring: ['0.875rem', '1.5'],
        arrayobject: ['0.875rem', { lineHeight: '2rem', color: 'red' }],
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
