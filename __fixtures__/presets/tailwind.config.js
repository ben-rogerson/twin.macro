const myConfigDefault = {
  theme: {
    extend: {
      colors: {
        hamburger: 'brown',
      },
    },
  },
}

const myConfig = {
  presets: [myConfigDefault],
  theme: {
    extend: {
      colors: {
        badass: '#bada55',
      },
    },
  },
}

module.exports = {
  presets: [myConfig],
  theme: {
    extend: {
      colors: {
        banana: 'yellow',
      },
    },
  },
}
