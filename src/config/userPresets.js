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
 */

export default {
  'styled-components': {
    styled: { import: 'default', from: 'styled-components' },
    css: { import: 'css', from: 'styled-components' },
    global: { import: 'createGlobalStyle', from: 'styled-components' },
  },
  emotion: {
    styled: { import: 'default', from: '@emotion/styled' },
    css: { import: 'css', from: '@emotion/react' },
    global: { import: 'Global', from: '@emotion/react' },
  },
  goober: {
    styled: { import: 'styled', from: 'goober' },
    css: { import: 'css', from: 'goober' },
    global: { import: 'createGlobalStyles', from: 'goober/global' },
  },
  stitches: {
    styled: { import: 'styled', from: 'stitches.config' },
    css: { import: 'css', from: 'stitches.config' },
    global: { import: 'global', from: 'stitches.config' },
  },
}
