/**
 * Config presets
 *
 * Usage in package.json/babel macro config:
 * module.exports = { twin: { preset: "styled-components" } }
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
}
