/**
 * Config presets
 *
 * To change the preset, add the following in `package.json`:
 * `{ "babelMacros": { "twin": { "preset": "styled-components" } } }`
 *
 * Or in `babel-plugin-macros.config.js`:
 * `module.exports = { twin: { preset: "styled-components" } }`
 */

const userPresets = {
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
  solid: {
    styled: { import: 'styled', from: 'solid-styled-components' },
    css: { import: 'css', from: 'solid-styled-components' },
    global: { import: 'createGlobalStyles', from: 'solid-styled-components' },
  },
}

export default userPresets
