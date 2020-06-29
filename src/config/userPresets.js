/**
 * Config presets
 *
 * To use, add the preset in package.json/babel macro config:
 *
 * Styled components
 * module.exports = { twin: { preset: "styled-components" } }
 *
 * Emotion
 * module.exports = { twin: { preset: "emotion" } }
 *
 * Goober
 * module.exports = { twin: { preset: "goober" } }
 */

export default {
  'styled-components': {
    styled: {
      import: 'default',
      from: 'styled-components',
    },
    css: {
      import: 'css',
      from: 'styled-components/macro',
    },
  },
  emotion: {
    styled: {
      import: 'default',
      from: '@emotion/styled',
    },
    css: {
      import: 'css',
      from: '@emotion/core',
    },
  },
  goober: {
    styled: {
      import: 'styled',
      from: 'goober',
    },
    css: {
      import: 'css',
      from: 'goober',
    },
  },
}
