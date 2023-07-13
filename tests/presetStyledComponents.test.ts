import { run, html } from './util/run'

const twinConfig = { preset: 'styled-components' } as const

test('tw prop', async () => {
  const input = html`<div tw="block" />`
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement("div", { css: { display: "block" } });
    `)
  })
})

test('css prop', async () => {
  const input = html`<div css="{{}}" />`
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement("div", { css: "{{}}" });
    `)
  })
})

test('tw dot', async () => {
  const input = 'tw.div`block`'
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import _styled from "styled-components";
      _styled.div({ display: "block" });
    `)
  })
})

test('tw', async () => {
  const input = 'tw`block`'
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ display: "block" });
    `)
  })
})

test('styled dot', async () => {
  const input = 'styled.div``'
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import _styled from "styled-components";
      _styled.div\`\`;
    `)
  })
})

test('styled dot alt', async () => {
  const input = 'styled.div([tw`block`])'
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import _styled from "styled-components";
      _styled.div([{ display: "block" }]);
    `)
  })
})

test('GlobalStyles', async () => {
  const input = html`<><GlobalStyles /></>`
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import { createGlobalStyle as _globalImport } from "styled-components";
      const _GlobalStyles = _globalImport\`*, ::before, ::after {  box-sizing: border-box;  border-width: 0;  border-style: solid;  border-color: #e5e7eb;  --tw-border-spacing-x: 0;  --tw-border-spacing-y: 0;  --tw-translate-x: 0;  --tw-translate-y: 0;  --tw-rotate: 0;  --tw-skew-x: 0;  --tw-skew-y: 0;  --tw-scale-x: 1;  --tw-scale-y: 1;  --tw-pan-x: var(--tw-empty,/*!*/ /*!*/);  --tw-pan-y: var(--tw-empty,/*!*/ /*!*/);  --tw-pinch-zoom: var(--tw-empty,/*!*/ /*!*/);  --tw-scroll-snap-strictness: proximity;  --tw-ordinal: var(--tw-empty,/*!*/ /*!*/);  --tw-slashed-zero: var(--tw-empty,/*!*/ /*!*/);  --tw-numeric-figure: var(--tw-empty,/*!*/ /*!*/);  --tw-numeric-spacing: var(--tw-empty,/*!*/ /*!*/);  --tw-numeric-fraction: var(--tw-empty,/*!*/ /*!*/);  --tw-ring-offset-shadow: 0 0 #0000;  --tw-ring-shadow: 0 0 #0000;  --tw-shadow: 0 0 #0000;  --tw-shadow-colored: 0 0 #0000;  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);  --tw-ring-offset-width: 0px;  --tw-ring-offset-color: #fff;  --tw-ring-color: rgb(59 130 246 / 0.5);  --tw-blur: var(--tw-empty,/*!*/ /*!*/);  --tw-brightness: var(--tw-empty,/*!*/ /*!*/);  --tw-contrast: var(--tw-empty,/*!*/ /*!*/);  --tw-grayscale: var(--tw-empty,/*!*/ /*!*/);  --tw-hue-rotate: var(--tw-empty,/*!*/ /*!*/);  --tw-invert: var(--tw-empty,/*!*/ /*!*/);  --tw-saturate: var(--tw-empty,/*!*/ /*!*/);  --tw-sepia: var(--tw-empty,/*!*/ /*!*/);  --tw-drop-shadow: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-blur: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-brightness: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-contrast: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-grayscale: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-hue-rotate: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-invert: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-opacity: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-saturate: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-sepia: var(--tw-empty,/*!*/ /*!*/);}::before, ::after {  --tw-content: '';}html {  line-height: 1.5;  -webkit-text-size-adjust: 100%;  -moz-tab-size: 4;  tab-size: 4;  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";  font-feature-settings:  normal;  font-variation-settings:  normal;}body {  margin: 0;  line-height: inherit;}hr {  height: 0;  color: inherit;  border-top-width: 1px;}abbr:where([title]) {  text-decoration: underline dotted;}h1, h2, h3, h4, h5, h6 {  font-size: inherit;  font-weight: inherit;}a {  color: inherit;  text-decoration: inherit;}b, strong {  font-weight: bolder;}code, kbd, samp, pre {  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;  font-size: 1em;}small {  font-size: 80%;}sub, sup {  font-size: 75%;  line-height: 0;  position: relative;  vertical-align: baseline;}sub {  bottom: -0.25em;}sup {  top: -0.5em;}table {  text-indent: 0;  border-color: inherit;  border-collapse: collapse;}button, input, optgroup, select, textarea {  font-family: inherit;  font-size: 100%;  font-weight: inherit;  line-height: inherit;  color: inherit;  margin: 0;  padding: 0;}button, select {  text-transform: none;}button, [type='button'], [type='reset'], [type='submit'] {  -webkit-appearance: button;  background-color: transparent;  background-image: none;}:-moz-focusring {  outline: auto;}:-moz-ui-invalid {  box-shadow: none;}progress {  vertical-align: baseline;}::-webkit-inner-spin-button, ::-webkit-outer-spin-button {  height: auto;}[type='search'] {  -webkit-appearance: textfield;  outline-offset: -2px;}::-webkit-search-decoration {  -webkit-appearance: none;}::-webkit-file-upload-button {  -webkit-appearance: button;  font: inherit;}summary {  display: list-item;}blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {  margin: 0;}fieldset {  margin: 0;  padding: 0;}legend {  padding: 0;}ol, ul, menu {  list-style: none;  margin: 0;  padding: 0;}textarea {  resize: vertical;}input::placeholder, textarea::placeholder {  opacity: 1;  color: #9ca3af;}button, [role="button"] {  cursor: pointer;}:disabled {  cursor: default;}img, svg, video, canvas, audio, iframe, embed, object {  display: block;  vertical-align: middle;}img, video {  max-width: 100%;  height: auto;}[hidden] {  display: none;}::backdrop {  --tw-border-spacing-x: 0;  --tw-border-spacing-y: 0;  --tw-translate-x: 0;  --tw-translate-y: 0;  --tw-rotate: 0;  --tw-skew-x: 0;  --tw-skew-y: 0;  --tw-scale-x: 1;  --tw-scale-y: 1;  --tw-pan-x: var(--tw-empty,/*!*/ /*!*/);  --tw-pan-y: var(--tw-empty,/*!*/ /*!*/);  --tw-pinch-zoom: var(--tw-empty,/*!*/ /*!*/);  --tw-scroll-snap-strictness: proximity;  --tw-ordinal: var(--tw-empty,/*!*/ /*!*/);  --tw-slashed-zero: var(--tw-empty,/*!*/ /*!*/);  --tw-numeric-figure: var(--tw-empty,/*!*/ /*!*/);  --tw-numeric-spacing: var(--tw-empty,/*!*/ /*!*/);  --tw-numeric-fraction: var(--tw-empty,/*!*/ /*!*/);  --tw-ring-offset-shadow: 0 0 #0000;  --tw-ring-shadow: 0 0 #0000;  --tw-shadow: 0 0 #0000;  --tw-shadow-colored: 0 0 #0000;  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);  --tw-ring-offset-width: 0px;  --tw-ring-offset-color: #fff;  --tw-ring-color: rgb(59 130 246 / 0.5);  --tw-blur: var(--tw-empty,/*!*/ /*!*/);  --tw-brightness: var(--tw-empty,/*!*/ /*!*/);  --tw-contrast: var(--tw-empty,/*!*/ /*!*/);  --tw-grayscale: var(--tw-empty,/*!*/ /*!*/);  --tw-hue-rotate: var(--tw-empty,/*!*/ /*!*/);  --tw-invert: var(--tw-empty,/*!*/ /*!*/);  --tw-saturate: var(--tw-empty,/*!*/ /*!*/);  --tw-sepia: var(--tw-empty,/*!*/ /*!*/);  --tw-drop-shadow: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-blur: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-brightness: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-contrast: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-grayscale: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-hue-rotate: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-invert: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-opacity: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-saturate: var(--tw-empty,/*!*/ /*!*/);  --tw-backdrop-sepia: var(--tw-empty,/*!*/ /*!*/);}\`;
      React.createElement(React.Fragment, null, React.createElement(_GlobalStyles, null));
    `)
  })
})
