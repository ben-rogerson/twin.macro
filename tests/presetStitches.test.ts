import { run, html } from './util/run'

const twinConfig = {
  preset: 'stitches',
  stitchesConfig: 'tests/stitches.config.js',
} as const

test('tw prop', async () => {
  const input = html`<div tw="block" />`
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import { styled as _styled } from "tests/stitches.config.js";
      const _TwComponent = _styled("div", { display: "block" });
      React.createElement(_TwComponent, null);
    `)
  })
})

test('css prop', async () => {
  const input = html`<div css="{{}}" />`
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import { styled as _styled } from "tests/stitches.config.js";
      const _TwComponent = _styled("div", {});
      React.createElement(_TwComponent, { css: "{{}}" });
    `)
  })
})

test('tw dot', async () => {
  const input = 'tw.div`block`'
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import { styled as _styled } from "tests/stitches.config.js";
      _styled("div", { display: "block" });
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
      import { styled as _styled } from "tests/stitches.config.js";
      _styled.div\`\`;
    `)
  })
})

test('styled dot alt', async () => {
  const input = 'styled.div([tw`block`])'
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      import { styled as _styled } from "tests/stitches.config.js";
      _styled("div", [{ display: "block" }]);
    `)
  })
})

test('GlobalStyles', async () => {
  const input = html`<><GlobalStyles /></>`
  return run(input, undefined, twinConfig)
    .then(result => {
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      expect(error).toMatchFormattedError(`
        MacroError: unknown: 

        ✕ The GlobalStyles import can’t be used with stitches

        Use the globalStyles import instead
      `)
    })
})

test('globalStyles', async () => {
  const input = html`globalStyles`
  return run(input, undefined, twinConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
          "*, ::before, ::after": {
            boxSizing: "border-box",
            borderWidth: "0",
            borderStyle: "solid",
            borderColor: "#e5e7eb",
            "--tw-border-spacing-x": "0",
            "--tw-border-spacing-y": "0",
            "--tw-translate-x": "0",
            "--tw-translate-y": "0",
            "--tw-rotate": "0",
            "--tw-skew-x": "0",
            "--tw-skew-y": "0",
            "--tw-scale-x": "1",
            "--tw-scale-y": "1",
            "--tw-pan-x": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-pan-y": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-pinch-zoom": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-scroll-snap-strictness": "proximity",
            "--tw-ordinal": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-slashed-zero": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-numeric-figure": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-numeric-spacing": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-numeric-fraction": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-ring-offset-shadow": "0 0 #0000",
            "--tw-ring-shadow": "0 0 #0000",
            "--tw-shadow": "0 0 #0000",
            "--tw-shadow-colored": "0 0 #0000",
            "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-ring-offset-width": "0px",
            "--tw-ring-offset-color": "#fff",
            "--tw-ring-color": "rgb(59 130 246 / 0.5)",
            "--tw-blur": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-brightness": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-contrast": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-grayscale": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-hue-rotate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-invert": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-saturate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-sepia": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-drop-shadow": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-blur": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-brightness": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-contrast": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-grayscale": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-hue-rotate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-invert": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-opacity": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-saturate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-sepia": "var(--tw-empty,/*!*/ /*!*/)",
          },
          "::before, ::after": { "--tw-content": "''" },
          html: {
            lineHeight: "1.5",
            WebkitTextSizeAdjust: "100%",
            MozTabSize: "4",
            tabSize: "4",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            fontFeatureSettings: " normal",
            fontVariationSettings: " normal",
          },
          body: { margin: "0", lineHeight: "inherit" },
          hr: { height: "0", color: "inherit", borderTopWidth: "1px" },
          "abbr:where([title])": { textDecoration: "underline dotted" },
          "h1, h2, h3, h4, h5, h6": { fontSize: "inherit", fontWeight: "inherit" },
          a: { color: "inherit", textDecoration: "inherit" },
          "b, strong": { fontWeight: "bolder" },
          "code, kbd, samp, pre": {
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: "1em",
          },
          small: { fontSize: "80%" },
          "sub, sup": { fontSize: "75%", lineHeight: "0", position: "relative", verticalAlign: "baseline" },
          sub: { bottom: "-0.25em" },
          sup: { top: "-0.5em" },
          table: { textIndent: "0", borderColor: "inherit", borderCollapse: "collapse" },
          "button, input, optgroup, select, textarea": {
            fontFamily: "inherit",
            fontSize: "100%",
            fontWeight: "inherit",
            lineHeight: "inherit",
            color: "inherit",
            margin: "0",
            padding: "0",
          },
          "button, select": { textTransform: "none" },
          "button, [type='button'], [type='reset'], [type='submit']": {
            WebkitAppearance: "button",
            backgroundColor: "transparent",
            backgroundImage: "none",
          },
          ":-moz-focusring": { outline: "auto" },
          ":-moz-ui-invalid": { boxShadow: "none" },
          progress: { verticalAlign: "baseline" },
          "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": { height: "auto" },
          "[type='search']": { WebkitAppearance: "textfield", outlineOffset: "-2px" },
          "::-webkit-search-decoration": { WebkitAppearance: "none" },
          "::-webkit-file-upload-button": { WebkitAppearance: "button", font: "inherit" },
          summary: { display: "list-item" },
          "blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre": { margin: "0" },
          fieldset: { margin: "0", padding: "0" },
          legend: { padding: "0" },
          "ol, ul, menu": { listStyle: "none", margin: "0", padding: "0" },
          textarea: { resize: "vertical" },
          "input::placeholder, textarea::placeholder": { opacity: "1", color: "#9ca3af" },
          'button, [role="button"]': { cursor: "pointer" },
          ":disabled": { cursor: "default" },
          "img, svg, video, canvas, audio, iframe, embed, object": {
            display: "block",
            verticalAlign: "middle",
          },
          "img, video": { maxWidth: "100%", height: "auto" },
          "[hidden]": { display: "none" },
          "::backdrop": {
            "--tw-border-spacing-x": "0",
            "--tw-border-spacing-y": "0",
            "--tw-translate-x": "0",
            "--tw-translate-y": "0",
            "--tw-rotate": "0",
            "--tw-skew-x": "0",
            "--tw-skew-y": "0",
            "--tw-scale-x": "1",
            "--tw-scale-y": "1",
            "--tw-pan-x": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-pan-y": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-pinch-zoom": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-scroll-snap-strictness": "proximity",
            "--tw-ordinal": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-slashed-zero": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-numeric-figure": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-numeric-spacing": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-numeric-fraction": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-ring-offset-shadow": "0 0 #0000",
            "--tw-ring-shadow": "0 0 #0000",
            "--tw-shadow": "0 0 #0000",
            "--tw-shadow-colored": "0 0 #0000",
            "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-ring-offset-width": "0px",
            "--tw-ring-offset-color": "#fff",
            "--tw-ring-color": "rgb(59 130 246 / 0.5)",
            "--tw-blur": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-brightness": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-contrast": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-grayscale": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-hue-rotate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-invert": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-saturate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-sepia": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-drop-shadow": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-blur": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-brightness": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-contrast": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-grayscale": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-hue-rotate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-invert": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-opacity": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-saturate": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-backdrop-sepia": "var(--tw-empty,/*!*/ /*!*/)",
          },
          "@keyframes spin": { to: { transform: "rotate(360deg)" } },
          "@keyframes ping": { "75%, 100%": { transform: "scale(2)", opacity: "0" } },
          "@keyframes pulse": { "50%": { opacity: ".5" } },
          "@keyframes bounce": {
            "0%, 100%": {
              transform: "translateY(-25%)",
              animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
            },
            "50%": { transform: "none", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
          },
        });
    `)
  })
})
