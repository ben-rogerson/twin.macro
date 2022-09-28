module.exports = {
  theme: {
    fontFamily: {
      // Tests the dynamic default html font
      sans: ['testSans', 'testSans2'],
      // Tests the dynamic default pre,code,kbd,samp value
      mono: ['testMono', 'testMono2'],
    },
    colors: {
      // Tests the dynamic default input/textarea placeholders
      gray: {
        400: 'grayish',
      },
    },
    ringOffsetWidth: {
      DEFAULT: '10px',
    },
    ringOffsetColor: {
      DEFAULT: 'rainbow',
    },
    borderColor: {
      // Tests the dynamic default border default color
      DEFAULT: 'blueish',
    },
  },
}
