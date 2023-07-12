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
        '@media (min-width: 1024px)': {
          "@media (prefers-color-scheme: dark)": { ":hover > *": { textDecorationLine: "underline" } },
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
        React.createElement("div", { css: { "lol:hover": { textDecorationLine: "underline" } } })
      )
    `)
  })
})

test('arbitrary variants are sorted correctly', async () => {
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
      ({ "& .foo_bar:hover": { textDecorationLine: "underline" } });
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

test('parent selectors before elements are kept', async () => {
  const input = 'tw`[&section]:block`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "&section": { display: "block" } });
    `)
  })
})

test('errors when separator is forgotten against a group', async () => {
  const input = 'tw`[em](block)`'
  expect.assertions(1)
  return run(input)
    .then(result => {
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      expect(error).toMatchFormattedError(`
      MacroError: unknown:

      ✕ [em](block) was not found
    `)
    })
})

it('should support aria variants', async () => {
  const input = [
    'tw`aria-checked:underline`',
    'tw`aria-[sort=ascending]:underline`',
    'tw`aria-[labelledby=a_b]:underline`',
    'tw`group-aria-checked:underline`',
    'tw`peer-aria-checked:underline`',
    'tw`group-aria-checked/foo:underline`',
    'tw`peer-aria-checked/foo:underline`',
    'tw`group-aria-[sort=ascending]:underline`',
    'tw`peer-aria-[sort=ascending]:underline`',
    'tw`group-aria-[labelledby=a_b]:underline`',
    'tw`peer-aria-[labelledby=a_b]:underline`',
    'tw`group-aria-[sort=ascending]/foo:underline`',
    'tw`peer-aria-[sort=ascending]/foo:underline`',
  ].join('; ')

  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '&[aria-checked="true"]': {
          "textDecorationLine": "underline"
        }
      });
      ({
        "&[aria-sort=ascending]": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "&[aria-labelledby=a b]": {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.group[aria-checked="true"] &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.peer[aria-checked="true"] ~ &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.group\\\\/foo[aria-checked="true"] &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.peer\\\\/foo[aria-checked="true"] ~ &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group[aria-sort=ascending] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer[aria-sort=ascending] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group[aria-labelledby=a b] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer[aria-labelledby=a b] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo[aria-sort=ascending] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo[aria-sort=ascending] ~ &": {
          "textDecorationLine": "underline"
        }
      });
    `)
  })
})

it('should support data variants', async () => {
  const input = [
    'tw`data-checked:underline`',
    'tw`data-[position=top]:underline`',
    'tw`data-[foo=bar_baz]:underline`',
    'tw`group-data-checked:underline`',
    'tw`peer-data-checked:underline`',
    'tw`group-data-checked/foo:underline`',
    'tw`peer-data-checked/foo:underline`',
    'tw`group-data-[position=top]:underline`',
    'tw`peer-data-[position=top]:underline`',
    'tw`group-data-[foo=bar_baz]:underline`',
    'tw`peer-data-[foo=bar_baz]:underline`',
    'tw`group-data-[position=top]/foo:underline`',
    'tw`peer-data-[position=top]/foo:underline`',
  ].join('; ')

  const config = { theme: { data: { checked: 'ui~="checked"' } } }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '&[data-ui~="checked"]': {
          "textDecorationLine": "underline"
        }
      });
      ({
        "&[data-position=top]": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "&[data-foo=bar baz]": {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.group[data-ui~="checked"] &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.peer[data-ui~="checked"] ~ &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.group\\\\/foo[data-ui~="checked"] &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        '.peer\\\\/foo[data-ui~="checked"] ~ &': {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group[data-position=top] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer[data-position=top] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group[data-foo=bar baz] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer[data-foo=bar baz] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo[data-position=top] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo[data-position=top] ~ &": {
          "textDecorationLine": "underline"
        }
      });
    `)
  })
})

it('should support supports', async () => {
  const input = [
    // Property check
    'tw`supports-[display:grid]:grid`',
    // Value with spaces, needs to be normalized
    'tw`supports-[transform-origin:5%_5%]:underline`',
    // Selectors (raw)
    'tw`supports-[selector(A>B)]:underline`',
    // 'not' check (raw)
    'tw`supports-[not(foo:bar)]:underline`',
    // 'or' check (raw)
    'tw`supports-[(foo:bar)or(bar:baz)]:underline`',
    // 'and' check (raw)
    'tw`supports-[(foo:bar)and(bar:baz)]:underline`',
    // No value give for the property, defaulting to prop: var(--tw)
    'tw`supports-[container-type]:underline`',
    // Named supports usage
    'tw`supports-grid:underline`',
  ].join('; ')
  const config = { theme: { supports: { grid: 'display: grid' } } }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "@supports (display:grid)": {
          "display": "grid"
        }
      });
      ({
        "@supports (transform-origin:5% 5%)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@supports selector(A>B)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@supports not (foo:bar)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@supports (foo:bar) or (bar:baz)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@supports (foo:bar) and (bar:baz)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@supports (container-type: var(--tw))": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@supports (display: grid)": {
          "textDecorationLine": "underline"
        }
      });
    `)
  })
})

it('should be possible to use modifiers and arbitrary groups', async () => {
  const input = [
    // Default group usage
    'tw`group-hover:underline`',
    // Arbitrary variants with pseudo class for group
    // With &
    'tw`group-[&:focus]:underline`',
    // Without &
    'tw`group-[:hover]:underline`',
    // Arbitrary variants with attributes selectors for group
    // With &
    'tw`group-[&[data-open]]:underline`',
    // Without &
    'tw`group-[[data-open]]:underline`',
    // Arbitrary variants with other selectors
    // With &
    'tw`group-[.in-foo_&]:underline`',
    // Without &
    'tw`group-[.in-foo]:underline`',
    // The same as above, but with modifiers
    'tw`group-hover/foo:underline`',
    'tw`group-[&:focus]/foo:underline`',
    'tw`group-[:hover]/foo:underline`',
    'tw`group-[&[data-open]]/foo:underline`',
    'tw`group-[[data-open]]/foo:underline`',
    'tw`group-[.in-foo_&]/foo:underline`',
    'tw`group-[.in-foo]/foo:underline`',
  ].join('; ')

  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        ".group:hover &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group:focus &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group:hover &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group[data-open] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group[data-open] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".in-foo .group &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group.in-foo &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo:hover &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo:focus &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo:hover &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo[data-open] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo[data-open] &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".in-foo .group\\\\/foo &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".group\\\\/foo.in-foo &": {
          "textDecorationLine": "underline"
        }
      });
    `)
  })
})

it('should be possible to use modifiers and arbitrary peers', async () => {
  const input = [
    // Default peer usage
    'tw`peer-hover:underline`',
    // Arbitrary variants with pseudo class for peer
    // With &
    'tw`peer-[&:focus]:underline`',
    // Without &
    'tw`peer-[:hover]:underline`',
    // Arbitrary variants with attributes selectors for peer
    // With &
    'tw`peer-[&[data-open]]:underline`',
    // Without &
    'tw`peer-[[data-open]]:underline`',
    // Arbitrary variants with other selectors
    // With &
    'tw`peer-[.in-foo_&]:underline`',
    // Without &
    'tw`peer-[.in-foo]:underline`',
    // The same as above, but with modifiers
    'tw`peer-hover/foo:underline`',
    'tw`peer-[&:focus]/foo:underline`',
    'tw`peer-[:hover]/foo:underline`',
    'tw`peer-[&[data-open]]/foo:underline`',
    'tw`peer-[[data-open]]/foo:underline`',
    'tw`peer-[.in-foo_&]/foo:underline`',
    'tw`peer-[.in-foo]/foo:underline`',
  ].join('; ')

  const result = await run(input)
  expect(result).toMatchFormattedJavaScript(`
      ({
        ".peer:hover ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer:focus ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer:hover ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer[data-open] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer[data-open] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".in-foo .peer ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer.in-foo ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo:hover ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo:focus ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo:hover ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo[data-open] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo[data-open] ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".in-foo .peer\\\\/foo ~ &": {
          "textDecorationLine": "underline"
        }
      });
      ({
        ".peer\\\\/foo.in-foo ~ &": {
          "textDecorationLine": "underline"
        }
      });
    `)
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
          "@media (min-width: 640px)": {
            "@media (min-width: 768px)": {
              "& one": { margin: "0.25rem" },
            }
          },
        });
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

  test('each selector is visited individually', async () => {
    const input = 'tw`[#blah,#app,pre,.pre,&.post,& section,.main &]:m-4`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
      ({ "& #blah,& #app,& pre,& .pre,&.post,& section,.main &": { margin: '1rem' } });
    `)
    })
  })

  test('mixed variants without parent selectors are handled', async () => {
    const input = 'tw`[one]:not-link:[two]:m-4`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ "one:not(:link) two": { margin: "1rem" } });
      `)
    })
  })

  test('mixed variants without parent selectors are handled 2', async () => {
    const input = 'tw`not-link:[one]:last:[two]:m-4`'
    return run(input).then(result => {
      expect(result).toMatchFormattedJavaScript(`
        ({ ":not(:link) one:last-child two": { "margin": "1rem" } });
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

test('nested at-rules 2', async () => {
  const input = 'tw`print:[@page]:underline`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '@media print': { '@page': { textDecorationLine: 'underline' } } });
    `)
  })
})

test('multiple variants containing commas throw unsupported error', async () => {
  const input = 'tw`[.this,.that]:first:block`'
  return run(input)
    .then(result => {
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      expect(error).toMatchFormattedError(`
        MacroError: unknown:

        ✕ The variants on [.this,.that]:first:block are invalid tailwind and twin classes

        To fix, either reduce all variants into a single arbitrary variant:
        From: \`[.this, .that]:first:block\`
        To: \`[.this:first, .that:first]:block\`
        
        Or split the class into separate classes instead of using commas:
        From: \`[.this, .that]:first:block\`
        To: \`[.this]:first:block [.that]:first:block\`\n\nRead more at https://twinredirect.page.link/arbitrary-variants-with-commas
      `)
    })
})
