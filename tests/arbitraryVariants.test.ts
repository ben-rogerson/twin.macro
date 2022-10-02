import { run, html } from './util/run'

test('basic arbitrary variants', async () => {
  const input = 'tw`[&>*]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '>*': { textDecorationLine: 'underline' } })
    `)
  })
})

test('spaces in selector (using _)', async () => {
  const input = 'tw`[.a.b_&]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '.a.b &': { textDecorationLine: 'underline' } })
    `)
  })
})

test('spaces in selector (using " ")', async () => {
  const input = 'tw`[.a.b &]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '.a.b &': { textDecorationLine: 'underline' } })
    `)
  })
})

test('arbitrary variants with modifiers', async () => {
  const input = 'tw`dark:lg:hover:[& > *]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '@media (prefers-color-scheme: dark)': {
          '@media (min-width: 1024px)': {
            '> *:hover': { textDecorationLine: 'underline' },
          },
        }
      })
    `)
  })
})

test('variants without & or an at-rule are handled', async () => {
  const input = html`
    <>
      <div tw="[div]:underline" />
      <div tw="[:hover]:underline" />
      <div tw="[wtf-bbq]:underline" />
      <div tw="[lol]:hover:underline" />
    </>
  `
  const config = { corePlugins: { preflight: false } }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement(
        React.Fragment,
        null,
        React.createElement('div', {
          css: { '& div': { textDecorationLine: 'underline' } },
        }),
        React.createElement('div', {
          css: { ':hover': { textDecorationLine: 'underline' } },
        }),
        React.createElement('div', {
          css: { '& wtf-bbq': { textDecorationLine: 'underline' } },
        }),
        React.createElement('div', {
          css: { ':hover lol': { textDecorationLine: 'underline' } },
        })
      )
    `)
  })
})

test('arbitrary variants are sorted after other variants', async () => {
  const input = 'tw`[& > *]:underline underline lg:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        textDecorationLine: 'underline',
        '@media (min-width: 1024px)': { textDecorationLine: 'underline' },
        '> *': { textDecorationLine: 'underline' },
      })
    `)
  })
})

test('using the important modifier', async () => {
  const input = 'tw`[&>*]:!underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '>*': { textDecorationLine: 'underline !important' } })
    `)
  })
})

test('at-rules', async () => {
  const input = 'tw`[@supports (what: ever)]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '@supports (what: ever)': { textDecorationLine: 'underline' } })
    `)
  })
})

test('at-rules with selector modifications', async () => {
  const input = 'tw`[@media (hover: hover) { &:hover }]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "@media (hover: hover)": { ":hover": { textDecorationLine: "underline" } } })
    `)
  })
})

test('nested at-rules with selector modifications', async () => {
  const input =
    'tw`[@media screen { @media (hover: hover) { &:hover } }]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '@media screen': {
          '@media (hover: hover)': { ':hover': { textDecorationLine: 'underline' } },
        },
      })
    `)
  })
})

test('attribute selectors', async () => {
  const input = 'tw`[&[data-open]]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "&[data-open]": { textDecorationLine: "underline" } })
    `)
  })
})

test('multiple attribute selectors', async () => {
  const input = 'tw`[&[data-foo][data-bar]:not([data-baz])]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '&[data-foo][data-bar]:not([data-baz])': {
          textDecorationLine: 'underline',
        },
      })
    `)
  })
})

test('multiple attribute selectors with custom separator (1)', async () => {
  const input = 'tw`[&[data-foo][data-bar]:not([data-baz])]__underline`'
  const config = { separator: '__' }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '&[data-foo][data-bar]:not([data-baz])': {
          textDecorationLine: 'underline',
        },
      })
    `)
  })
})

test('multiple attribute selectors with custom separator (2)', async () => {
  const input = 'tw`[&[data-foo][data-bar]:not([data-baz])]_@underline`'
  const config = { separator: '_@' }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '&[data-foo][data-bar]:not([data-baz])': {
          textDecorationLine: 'underline',
        },
      })
    `)
  })
})

test('keeps escaped underscores', async () => {
  const input = 'tw`[&_.foo\\_bar]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "& .foo_bar": { textDecorationLine: "underline" } })
    `)
  })
})

test('keeps escaped underscores with multiple arbitrary variants', async () => {
  const input = 'tw`[&_.foo\\_bar]:[&_.bar\\_baz]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "& .bar_baz .foo_bar": { textDecorationLine: "underline" } })
    `)
  })
})

test('keeps escaped underscores in arbitrary variants mixed with normal variants', async () => {
  const input = [
    'tw`[&_.foo\\_bar]:hover:underline`',
    'tw`hover:[&_.foo\\_bar]:underline`',
  ].join('; ')
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ ':hover .foo_bar': { textDecorationLine: 'underline' } });
      ({ '& .foo_bar:hover': { textDecorationLine: 'underline' } });
    `)
  })
})

test('allows attribute variants with quotes', async () => {
  const input = [
    "tw`[&[data-test='2']]:underline`",
    'tw`[&[data-test="2"]]:underline`',
  ].join('; ')
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "&[data-test='2']": { textDecorationLine: 'underline' } });
      ({ '&[data-test="2"]': { textDecorationLine: 'underline' } });
    `)
  })
})

test('classes in arbitrary variants should not be prefixed', async () => {
  const input = 'tw`[.foo &]:tw-text-red-400 [.fum &]:first:tw-text-green-400`'
  const config = { prefix: 'tw-' }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '.foo &': {
          '--tw-text-opacity': '1',
          color: 'rgb(248 113 113 / var(--tw-text-opacity))',
        },
        '.fum &:first-child': {
          '--tw-text-opacity': '1',
          color: 'rgb(74 222 128 / var(--tw-text-opacity))',
        },
      })
    `)
  })
})

test('classes in the same arbitrary variant should not be prefixed', async () => {
  const input = [
    'tw`[.foo &]:tw-text-red-400 [.foo &]:tw-bg-white`',
    'tw`[& .foo]:tw-text-red-400 [& .foo]:tw-bg-white`',
  ].join('; ')
  const config = { prefix: 'tw-' }
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '.foo &': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(255 255 255 / var(--tw-bg-opacity))',
          '--tw-text-opacity': '1',
          color: 'rgb(248 113 113 / var(--tw-text-opacity))',
        },
      })
      ;({
        '& .foo': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(255 255 255 / var(--tw-bg-opacity))',
          '--tw-text-opacity': '1',
          color: 'rgb(248 113 113 / var(--tw-text-opacity))',
        },
      }) 
    `)
  })
})
test('nested at-rules', async () => {
  const input = 'tw`[@media_screen { @media (hover: hover) }]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "@media screen": { "@media (hover: hover)": { textDecorationLine: "underline" } } });
    `)
  })
})
