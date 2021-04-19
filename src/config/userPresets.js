/**
 * Config presets
 *
 * To use, add the preset in package.json/babel macro config:
 *
 * styled-components
 * { "babelMacros": { "twin": { "preset": "styled-components" } } }
 * module.exports = { twin: { preset: "styled-components" } }
 *
 * emotion
 * { "babelMacros": { "twin": { "preset": "emotion" } } }
 * module.exports = { twin: { preset: "emotion" } }
 *
 * goober
 * { "babelMacros": { "twin": { "preset": "goober" } } }
 * module.exports = { twin: { preset: "goober" } }
 *
 * solid
 * { "babelMacros": { "twin": { "preset": "solid" } } }
 * module.exports = { twin: { preset: "solid" } }
 */

export default {
  'styled-components': {
    styled: {
      import: 'default',
      from: 'styled-components/macro',
    },
    css: {
      import: 'css',
      from: 'styled-components',
    },
    global: {
      import: 'createGlobalStyle',
      from: 'styled-components',
    },
  },
  emotion: {
    styled: {
      import: 'default',
      from: '@emotion/styled',
    },
    css: {
      import: 'css',
      from: '@emotion/react',
    },
    global: {
      import: 'Global',
      from: '@emotion/react',
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
    global: {
      import: 'createGlobalStyles',
      from: 'goober/global',
    },
  },
  solid: {
    styled: {
      import: 'styled',
      from: 'solid-styled-components',
    },
    css: {
      import: 'css',
      from: 'solid-styled-components',
    },
    global: {
      import: 'createGlobalStyles',
      from: 'solid-styled-components',
    },
  },
}
