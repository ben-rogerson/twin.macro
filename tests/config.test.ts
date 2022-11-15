import type { TwinConfig } from './types'
import { run, html } from './util/run'

describe('includeClassNames', () => {
  describe('When set to true', () => {
    test('Then a tw class in the className attribute', async () => {
      const input = html` <div className="first:block" />`
      const twinConfig = { includeClassNames: true }

      return run(input, undefined, twinConfig).then((result: string) => {
        expect(result).toMatchFormattedJavaScript(`
          React.createElement("div", { css: { ":first-child": { display: "block" } } });
        `)
      })
    })

    test('Then non-tw classes are preserved', async () => {
      const input = html`
        <div className="last:(inline non-tw-class mt-5) another-non-tw-class" />
      `
      const twinConfig = { includeClassNames: true }

      return run(input, undefined, twinConfig).then((result: string) => {
        expect(result).toMatchFormattedJavaScript(`
          React.createElement("div", {
            className: "last:non-tw-class another-non-tw-class",
            css: { ":last-child": { marginTop: "1.25rem", display: "inline" } },
          });
        `)
      })
    })
  })

  describe('When set to false', () => {
    test('Then all classes are preserved', async () => {
      const input = html`
        <div className="last:(inline non-tw-class mt-5) another-non-tw-class" />
      `
      const twinConfig = { includeClassNames: false }

      return run(input, undefined, twinConfig).then((result: string) => {
        expect(result).toMatchFormattedJavaScript(`
          React.createElement("div", { className: "last:(inline non-tw-class mt-5) another-non-tw-class" });
        `)
      })
    })
  })
})

describe('sassyPseudo', () => {
  describe('When set to true', () => {
    test('Then ::before is prefixed with the parent selector', async () => {
      const input = 'tw`before:block`'
      const twinConfig = { sassyPseudo: true }
      return run(input, undefined, twinConfig).then(result => {
        expect(result).toMatchFormattedJavaScript(`
          ({
            "&::before": {
              "content": "var(--tw-content)",
              "display": "block"
            }
          });
        `)
      })
    })
  })

  describe('When set to false', () => {
    test('Then ::before is not prefixed with the parent selector', async () => {
      const input = 'tw`before:block`'
      const twinConfig = { sassyPseudo: false }
      return run(input, undefined, twinConfig).then(result => {
        expect(result).toMatchFormattedJavaScript(`
          ({
            "::before": {
              "content": "var(--tw-content)",
              "display": "block"
            }
          });
        `)
      })
    })
  })
})

describe('config', () => {
  describe('When tailwind config added via twin config', () => {
    test('Then tailwind config colors can be used', async () => {
      const input = 'tw`bg-primary text-white`'
      const twinConfig = {
        config: { theme: { extend: { colors: { primary: 'black' } } } },
      }
      return run(input, undefined, twinConfig).then(result => {
        expect(result).toMatchFormattedJavaScript(`
          ({
            "--tw-bg-opacity": "1",
            backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity))",
            "--tw-text-opacity": "1",
            color: "rgb(255 255 255 / var(--tw-text-opacity))",
          });
        `)
      })
    })
  })
  describe('When tailwind config added via twin config with added tailwind config', () => {
    test('Then custom config from twin config is dropped', async () => {
      const input = 'tw`bg-primary text-red-500`'
      const tailwindConfig = {
        theme: { extend: { colors: { primary: 'black' } } },
      }
      const twinConfig = {
        config: {
          theme: { extend: { colors: { primary: 'white' } } },
        },
      }
      return run(input, tailwindConfig, twinConfig).then(result => {
        expect(result).toMatchFormattedJavaScript(
          `
          ({
            "--tw-bg-opacity": "1",
            backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity))",
            "--tw-text-opacity": "1",
            color: "rgb(239 68 68 / var(--tw-text-opacity))",
          });
        `
        )
      })
    })
    test('Then error when using color from twin config', async () => {
      const input = 'tw`bg-primary text-red-500 text-sec`'
      const tailwindConfig = {
        theme: { extend: { colors: { primary: 'black' } } },
      }
      const twinConfig = {
        config: {
          theme: { extend: { colors: { primary: 'white', sec: 'red' } } },
        },
      }

      expect.assertions(1)

      return run(input, tailwindConfig, twinConfig)
        .then(result => {
          expect(result).toMatchFormattedJavaScript(``)
        })
        .catch(error => {
          expect(error).toMatchFormattedError(`
            MacroError: unknown:

            ✕ text-sec was not found

              Try one of these classes:

              - text-sm
              - select-text > select-text
              - text-base
              - text-start > text-start
              - text-xs
            `)
        })
    })
  })
})

describe('moveKeyframesToGlobalStyles', () => {
  describe('When set to true', () => {
    test('Then animation classes don’t have keyframes', async () => {
      const input = html`<div tw="animate-bounce" />`
      const twinConfig = { moveKeyframesToGlobalStyles: true }

      return run(input, undefined, twinConfig).then((result: string) => {
        expect(result).toMatchFormattedJavaScript(`
          React.createElement("div", { css: { animation: "bounce 1s infinite" } });
        `)
      })
    })

    test('Then animation classes do have keyframes', async () => {
      const input = html`<div tw="animate-bounce" /> `
      const twinConfig = { moveKeyframesToGlobalStyles: false }

      return run(input, undefined, twinConfig).then((result: string) => {
        expect(result).toMatchFormattedJavaScript(`
          React.createElement("div", {
            css: {
              "@keyframes bounce": {
                "0%, 100%": {
                  transform: "translateY(-25%)",
                  animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
                },
                "50%": { transform: "none", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
              },
              animation: "bounce 1s infinite",
            },
          });
        `)
      })
    })

    test('Stitches has no keyframes', async () => {
      const input = html`<div tw="animate-bounce" /> `
      const twinConfig = {
        preset: 'stitches' as string,
        stitchesConfig: 'tests/stitches.config.js',
      } as unknown as TwinConfig

      return run(input, undefined, twinConfig).then((result: string) => {
        expect(result).toMatchFormattedJavaScript(`
          import { styled as _styled } from "tests/stitches.config.js";
          const _TwComponent = _styled("div", { animation: "bounce 1s infinite" });
          React.createElement(_TwComponent, null);
        `)
      })
    })
  })
})
