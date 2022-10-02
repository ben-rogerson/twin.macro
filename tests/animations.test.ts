import { run, html } from './util/run'

test('basic', async () => {
  const input = html`
    <>
      <div tw="animate-spin"></div>
      <div tw="hover:animate-ping"></div>
      <div tw="group-hover:animate-bounce"></div>
    </>
  `

  return run(input, {}).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          css: {
            "@keyframes spin": { to: { transform: "rotate(360deg)" } },
            animation: "spin 1s linear infinite",
          },
        }),
        React.createElement("div", {
          css: {
            "@keyframes ping": { "75%, 100%": { transform: "scale(2)", opacity: "0" } },
            ":hover": { animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" },
          },
        }),
        React.createElement("div", {
          css: {
            "@keyframes bounce": {
              "0%, 100%": {
                transform: "translateY(-25%)",
                animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
              },
              "50%": { transform: "none", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
            },
            ".group:hover &": { animation: "bounce 1s infinite" },
          },
        })
      );
    `)
  })
})

test('custom', async () => {
  const input = html`<div tw="animate-one"></div>`
  const config = {
    theme: {
      extend: {
        keyframes: { one: { to: { transform: 'rotate(360deg)' } } },
        animation: { one: 'one 2s' },
      },
    },
  }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement("div", {
        css: { "@keyframes one": { to: { transform: "rotate(360deg)" } }, animation: "one 2s" },
      });
    `)
  })
})

test('custom prefixed', async () => {
  const input = html`<div tw="tw-animate-one"></div>`
  const config = {
    prefix: 'tw-',
    theme: {
      extend: {
        keyframes: {
          one: { to: { transform: 'rotate(360deg)' } },
        },
        animation: { one: 'one 2s' },
      },
    },
  }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement("div", {
          css: { "@keyframes tw-one": { to: { transform: "rotate(360deg)" } }, animation: "tw-one 2s" },
      })
    `)
  })
})

test('multiple', async () => {
  const input = html`<div tw="animate-multiple"></div>`
  const config = {
    theme: {
      extend: {
        animation: { multiple: 'bounce 2s linear, pulse 3s ease-in' },
      },
    },
  }

  return run(input, config).then(result => {
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
          "@keyframes pulse": { "50%": { opacity: ".5" } },
          animation: "bounce 2s linear, pulse 3s ease-in",
        },
      });
    `)
  })
})

test('multiple custom', async () => {
  const input = html`<div tw="animate-multiple"></div>`
  const config = {
    theme: {
      extend: {
        keyframes: {
          one: { to: { transform: 'rotate(360deg)' } },
          two: { to: { transform: 'scale(1.23)' } },
        },
        animation: { multiple: 'one 2s, two 3s' },
      },
    },
  }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement("div", {
        css: {
          "@keyframes one": { to: { transform: "rotate(360deg)" } },
          "@keyframes two": { to: { transform: "scale(1.23)" } },
          animation: "one 2s, two 3s",
        },
      });
    `)
  })
})

test('with dots in the name', async () => {
  const input = html`
    <>
      <div tw="animate-zoom-.5"></div>
      <div tw="animate-zoom-1.5"></div>
    </>
  `
  const config = {
    theme: {
      extend: {
        keyframes: {
          'zoom-.5': { to: { transform: 'scale(0.5)' } },
          'zoom-1.5': { to: { transform: 'scale(1.5)' } },
        },
        animation: {
          'zoom-.5': 'zoom-.5 2s',
          'zoom-1.5': 'zoom-1.5 2s',
        },
      },
    },
  }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          css: {
            "@keyframes zoom-\\\\.5": { to: { transform: "scale(0.5)" } },
            animation: "zoom-\\\\.5 2s"
          },
        }),
        React.createElement("div", {
          css: {
            "@keyframes zoom-1\\\\.5": { to: { transform: "scale(1.5)" } },
            animation: "zoom-1\\\\.5 2s",
          },
        })
      );
    `)
  })
})

test('with dots in the name and prefix', async () => {
  const input = html`
    <>
      <div tw="tw-animate-zoom-.5"></div>
      <div tw="tw-animate-zoom-1.5"></div>
    </>
  `
  const config = {
    prefix: 'tw-',
    theme: {
      extend: {
        keyframes: {
          'zoom-.5': { to: { transform: 'scale(0.5)' } },
          'zoom-1.5': { to: { transform: 'scale(1.5)' } },
        },
        animation: {
          'zoom-.5': 'zoom-.5 2s',
          'zoom-1.5': 'zoom-1.5 2s',
        },
      },
    },
  }

  return run(input, config).then((result: string) => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          css: {
            "@keyframes tw-zoom-\\\\.5": { to: { transform: "scale(0.5)" } },
            animation: "tw-zoom-\\\\.5 2s",
          },
        }),
        React.createElement("div", {
          css: {
            "@keyframes tw-zoom-1\\\\.5": { to: { transform: "scale(1.5)" } },
            animation: "tw-zoom-1\\\\.5 2s",
          },
        })
      );
    `)
  })
})
