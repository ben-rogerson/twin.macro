import { run } from './util/run'

it('should be possible to differentiate between decoration utilities', async () => {
  const input = 'tw`decoration-[#ccc] decoration-[3px]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ textDecorationColor: "#ccc", textDecorationThickness: "3px" });
    `)
  })
})

it('should support modifiers for arbitrary values that contain the separator', async () => {
  const input = "tw`hover:bg-[url('https://github.com/tailwindlabs.png')]`"
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ ":hover": { backgroundImage: "url('https://github.com/tailwindlabs.png')" } });
    `)
  })
})

it('should support arbitrary values for various background utilities', async () => {
  const input = [
    'tw`bg-gradient-to-r`',
    'tw`bg-red-500`',
    "tw`bg-[url('/image-1-0.png')]`",
    'tw`bg-[#ff0000]`',
    'tw`bg-[rgb(var(--bg-color))]`',
    'tw`bg-[hsl(var(--bg-color))]`',
    'tw`bg-[url:var(--image-url)]`',
    'tw`bg-[color:var(--bg-color)]`',
  ].join('; ')
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))' })
      ;({
        '--tw-bg-opacity': '1',
        backgroundColor: 'rgb(239 68 68 / var(--tw-bg-opacity))',
      })
      ;({ backgroundImage: "url('/image-1-0.png')" })
      ;({
        '--tw-bg-opacity': '1',
        backgroundColor: 'rgb(255 0 0 / var(--tw-bg-opacity))',
      })
      ;({ backgroundColor: 'rgb(var(--bg-color))' })
      ;({ backgroundColor: 'hsl(var(--bg-color))' })
      ;({ backgroundImage: 'var(--image-url)' })
      ;({ backgroundColor: 'var(--bg-color)' })
    `)
  })
})

it('should error if an unknown typehint is used', async () => {
  const input = 'tw`inset-[hmm:12px]`'
  expect.assertions(1)
  return run(input)
    .then(result => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toMatchFormattedError(`
      MacroError: unknown:

      ✕ inset-[hmm:12px] was not found

      Try one of these classes:

      - inset-12 > 3rem
      - inset-px > 1px
      - inset-x-12 > 3rem
      - inset-x-px > 1px
      - inset-y-12 > 3rem
    `)
    })
})

it('should handle unknown typehints', async () => {
  const input = 'tw`w-[length:12px]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ width: "12px" });
    `)
  })
})

it('should convert _ to spaces', async () => {
  const input = [
    'tw`grid-cols-[200px_repeat(auto-fill,minmax(15%,100px))_300px]`',
    'tw`grid-rows-[200px_repeat(auto-fill,minmax(15%,100px))_300px]`',
    'tw`shadow-[0px_0px_4px_black]`',
    'tw`rounded-[0px_4px_4px_0px]`',
    'tw`m-[8px_4px]`',
    'tw`p-[8px_4px]`',
    'tw`flex-[1_1_100%]`',
    'tw`col-[span_3_/_span_8]`',
    'tw`row-[span_3_/_span_8]`',
    'tw`auto-cols-[minmax(0,_1fr)]`',
    'tw`drop-shadow-[0px_1px_3px_black]`',
    'tw`content-[_hello_world_]`',
    'tw`content-[___abc____]`',
    "tw`content-['__hello__world__']`",
  ].join('; ')
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ gridTemplateColumns: "200px repeat(auto-fill,minmax(15%,100px)) 300px" });
      ({ gridTemplateRows: "200px repeat(auto-fill,minmax(15%,100px)) 300px" });
      ({
        "--tw-shadow": "0px 0px 4px black",
        "--tw-shadow-colored": "0px 0px 4px var(--tw-shadow-color)",
        boxShadow:
          "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
      });
      ({ borderRadius: "0px 4px 4px 0px" });
      ({ margin: "8px 4px" });
      ({ padding: "8px 4px" });
      ({ flex: "1 1 100%" });
      ({ gridColumn: "span 3 / span 8" });
      ({ gridRow: "span 3 / span 8" });
      ({ gridAutoColumns: "minmax(0, 1fr)" });
      ({
        "--tw-drop-shadow": "drop-shadow(0px 1px 3px black)",
        filter:
          "var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)",
      });
      ({ "--tw-content": "hello world", content: "var(--tw-content)" });
      ({ "--tw-content": "abc", content: "var(--tw-content)" });
      ({ "--tw-content": "'  hello  world  '", content: "var(--tw-content)" });
    `)
  })
})

it('should not convert escaped underscores with spaces', async () => {
  const input = "tw`content-['snake\\_case']`"
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "--tw-content": "'snake_case'", content: "var(--tw-content)" });
    `)
  })
})

it('should support colons in URLs', async () => {
  const input = "tw`bg-[url('https://www.spacejam.com/1996/img/bg_stars.gif')]`"
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ backgroundImage: "url('https://www.spacejam.com/1996/img/bg_stars.gif')" });
    `)
  })
})

it('should support unescaped underscores in URLs', async () => {
  const input = "tw`bg-[url('brown_potato.jpg'),_url('red_tomato.png')]`"
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ backgroundImage: "url('brown_potato.jpg'), url('red_tomato.png')" });
    `)
  })
})

it('reads theme values in arbitrary values (without quotes)', async () => {
  const input = 'tw`w-[theme(spacing.1)] w-[theme(spacing[0.5])]`'
  const config = {
    theme: { spacing: { 0.5: 'calc(.5 * .25rem)', 1: 'calc(1 * .25rem)' } },
  }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ width: "calc(.5 * .25rem)" });
    `)
  })
})

it('reads theme values in arbitrary values (with quotes)', async () => {
  const input = "tw`w-[theme('spacing.1')] w-[theme('spacing[0.5]')]`"
  const config = {
    theme: { spacing: { 0.5: 'calc(.5 * .25rem)', 1: 'calc(1 * .25rem)' } },
  }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ width: "calc(.5 * .25rem)" });
    `)
  })
})

it('reads theme values in arbitrary values (with quotes) when inside calc or similar functions', async () => {
  const input =
    "tw`w-[calc(100%-theme('spacing.1'))] w-[calc(100%-theme('spacing[0.5]'))]`"
  const config = {
    theme: {
      spacing: {
        0.5: 'calc(.5 * .25rem)',
        1: 'calc(1 * .25rem)',
      },
    },
  }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ width: "calc(100% - calc(.5 * .25rem))" });
    `)
  })
})

it('should not output unparsable arbitrary CSS values', async () => {
  // eslint-disable-next-line no-template-curly-in-string
  const input = 'tw`w-[${sizes.width}]`'
  expect.assertions(1)

  return run(input)
    .then(result => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toMatchFormattedError(`
      MacroError: unknown: 

      ✕ Your classes need to be complete strings for Twin to detect them correctly
    
      Read more at https://twinredirect.page.link/template-literals
    `)
    })
})

it('should correctly validate each part when checking for `percentage` data types', async () => {
  const input = 'tw`bg-[top_right_50%]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ backgroundPosition: "top right 50%" });
    `)
  })
})

it('should correctly validate background size', async () => {
  const input = 'tw`bg-[length:auto_auto,cover,_contain,10px,10px_10%]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ backgroundSize: "auto auto,cover, contain,10px,10px 10%" });
    `)
  })
})

it('should correctly validate combination of percentage and length', async () => {
  const input = 'tw`bg-[50px_10%]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "backgroundPosition": "50px 10%" });
    `)
  })
})

it('can explicitly specify type for percentage and length', async () => {
  const input = 'tw`bg-[position:50%_10%]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "backgroundPosition": "50% 10%" });
    `)
  })
})
