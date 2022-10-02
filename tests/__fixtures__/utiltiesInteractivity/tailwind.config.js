module.exports = {
  theme: {
    extend: {
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
