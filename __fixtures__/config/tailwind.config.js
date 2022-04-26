module.exports = {
  theme: {
    animation: {
      'zoom-.5': 'zoom-.5 2s',
    },
    colors: {
      number: 0,
      purple: 'purple',
      'purple-hyphen': 'purple-hyphen',
      mycolors: {
        DEFAULT: 'blue',
        'a-purple': 'purple',
        'a-number': 0,
        array: ['blue', 'purple', 'orange'],
      },
      'my-blue': {
        100: 'blue',
      },
      'color-opacity': ({ opacityVariable }) =>
        `rgba(var(--color-primary), var(${opacityVariable}, 1))`,
      color: {
        deep: {
          config: {
            500: '#0747A6',
          },
        },
      },
      blue: {
        DEFAULT: 'blue-default',
        gray: { 200: "this-gets-trumped by 'blue-gray: {200}'" },
      },
      'blue-gray': {
        DEFAULT: 'blue-gray-default',
        200: 'blue-gray-200',
      },
      'blue-gray-green': {
        DEFAULT: 'blue-gray-green-default',
        200: 'blue-gray-green-200',
        'deep-dish': {
          DEFAULT: 'blue-gray-green-deep-dish-default',
          200: 'blue-gray-green-deep-dish-200',
        },
      },
      'blue-gray-green-pink': 'blue-gray-green-pink',
    },
    fontWeight: {
      customFontWeightAsString: '700',
      // Tailwind accepts numbers in configuration as well
      // https://tailwindcss.com/docs/font-weight#font-weights
      customFontWeightAsNumber: 800,
    },
  },
}
