import { run } from './util/run'

const defaultScreens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

it('sorts min and max correctly relative to screens and each other', async () => {
  const input = `tw\`font-bold max-[800px]:font-bold max-[700px]:font-bold sm:font-bold min-[700px]:font-bold md:font-bold min-[800px]:font-bold\``
  const config = { theme: { screens: defaultScreens } }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "fontWeight": "700",
        "@media (max-width: 800px)": {
          "fontWeight": "700"
        },
        "@media (max-width: 700px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 640px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 700px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 768px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 800px)": {
          "fontWeight": "700"
        }
      });
    `)
  })
})

it('works when using min variants screens config is empty and variants all use the same unit', async () => {
  const input = `tw\`font-bold min-[700px]:font-bold min-[800px]:font-bold\``
  const config = { theme: { screens: {} } }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
    ({
      "fontWeight": "700",
      "@media (min-width: 700px)": {
        "fontWeight": "700"
      },
      "@media (min-width: 800px)": {
        "fontWeight": "700"
      }
    });
  `)
  })
})

it('works when using max variants screens config is empty and variants all use the same unit', async () => {
  const input = `tw\`font-bold max-[800px]:font-bold max-[700px]:font-bold\``
  const config = { theme: { screens: {} } }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "fontWeight": "700",
        "@media (max-width: 800px)": {
          "fontWeight": "700"
        },
        "@media (max-width: 700px)": {
          "fontWeight": "700"
        }
      })
    `)
  })
})

it('converts simple min-width screens for max variant', async () => {
  const input = `tw\`font-bold max-lg:font-bold max-[700px]:font-bold max-sm:font-bold max-[300px]:font-bold sm:font-bold md:font-bold\``
  const config = { theme: { screens: defaultScreens } }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "fontWeight": "700",
        "@media not all and (min-width: 1024px)": {
          "fontWeight": "700"
        },
        "@media (max-width: 700px)": {
          "fontWeight": "700"
        },
        "@media not all and (min-width: 640px)": {
          "fontWeight": "700"
        },
        "@media (max-width: 300px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 640px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 768px)": {
          "fontWeight": "700"
        }
      })
    `)
  })
})

it('does not have keyed screens for min variant', async () => {
  const input = `tw\`font-bold min-[300px]:font-bold sm:font-bold min-[700px]:font-bold md:font-bold\``
  const config = { theme: { screens: defaultScreens } }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "fontWeight": "700",
        "@media (min-width: 300px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 640px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 700px)": {
          "fontWeight": "700"
        },
        "@media (min-width: 768px)": {
          "fontWeight": "700"
        }
      })
    `)
  })
})
