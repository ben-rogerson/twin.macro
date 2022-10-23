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
          // eslint-disable-next-line jest/no-conditional-expect
          expect(result).toMatchFormattedJavaScript(``)
        })
        .catch(error => {
          // eslint-disable-next-line jest/no-conditional-expect
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
