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
            ':hover > *': { textDecorationLine: 'underline' }
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
      ({ '@media (hover: hover)': { ':hover': { textDecorationLine: 'underline' } } })
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
      ({ '&[data-open]': { textDecorationLine: 'underline' } })
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
      ({ '& .foo_bar': { textDecorationLine: 'underline' } })
    `)
  })
})

test('keeps escaped underscores with multiple arbitrary variants', async () => {
  const input = 'tw`[&_.foo\\_bar]:[&_.bar\\_baz]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '& .foo_bar .bar_baz': { textDecorationLine: 'underline' } });
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
      ({ ':hover .foo_bar': { textDecorationLine: 'underline' } });
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

test('errors when separator is forgotten against a group', async () => {
  const input = 'tw`[em](block)`'
  expect.assertions(1)
  return run(input).catch(error => {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(error).toMatchFormattedError(`
      MacroError: unknown:

      ✕ [em](block) was not found
    `)
  })
})

describe('auto parent selector', () => {
  test('selectors containing a parent selector are preserved', async () => {
    const input = 'tw`md:[.test &]:m-1`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ "@media (min-width: 768px)": { ".test &": { margin: "0.25rem" } } });
      `)
    })
  })

  test('media queries are preserved', async () => {
    const input = 'tw`[@media blah]:m-1`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({
          "@media blah": { margin: "0.25rem" },
        });
      `)
    })
  })

  test('pseudo elements are prefixed', async () => {
    const input = 'tw`[:hover]:m-1`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ ":hover": { margin: "0.25rem" } });
      `)
    })
  })

  test('selectors are prefixed when media variants precede', async () => {
    const input = 'tw`md:sm:[one]:m-1`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({
          "@media (min-width: 768px)": {
            "@media (min-width: 640px)": {
              "& one": { margin: "0.25rem" },
            }
          },
        });
      `)
    })
  })

  test('non-arbitrary variants are placed at the end', async () => {
    const input = 'tw`file:first:[one]:m-1`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ ':first-child::file-selector-button one': { margin: '0.25rem' } });
      `)
    })
  })

  test('multiple parentless variants have order preserved (groups)', async () => {
    const input = 'tw`[one]:(m-2 [two]:(m-3 [three]:(m-4)))`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({
          '& one': { margin: '0.5rem' },
          '& one two': { margin: '0.75rem' },
          '& one two three': { margin: '1rem' },
        });
      `)
    })
  })

  test('multiple parentless variants have order preserved (groupless)', async () => {
    const input = 'tw`[one]:[two]:[three]:m-4`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ '& one two three': { margin: '1rem' } });
      `)
    })
  })

  test('multiple parentless variants amongst pseudo variants have arbitrary variants at the end', async () => {
    const input = 'tw`[one]:[two]:not-link:[three]:[four]:m-4`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ ':not(:link) one two three four': { margin: '1rem' } });
      `)
    })
  })

  test('multiple parentless variants amongst media variants', async () => {
    const input = 'tw`[one]:[two]:md:[three]:[four]:m-4`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ '@media (min-width: 768px)': { '& one two three four': { margin: '1rem' } } });
      `)
    })
  })
})

test('parent selector at end is handled', async () => {
  const input = 'tw`[path&]:first:[stroke: #000]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "path:first-child": { "stroke": "#000" } });
    `)
  })
})

test('nested at-rules', async () => {
  const input = 'tw`[@media_screen { @media (hover: hover) }]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '@media screen': { '@media (hover: hover)': { textDecorationLine: 'underline' } } });
    `)
  })
})
