import { run } from './util/run'

test('basic arbitrary property', async () => {
  const input = 'tw`[paint-order:markers]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`({ paintOrder: "markers" });`)
  })
})

test('arbitrary properties with modifiers', async () => {
  const input = 'tw`dark:lg:hover:[paint-order:markers]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        '@media (min-width: 1024px)': {
          '@media (prefers-color-scheme: dark)': { ':hover': { paintOrder: 'markers' } },
        },
      })  
    `)
  })
})

test('arbitrary properties are sorted after utilities', async () => {
  const input =
    'tw`[paint-order:markers] content-none hover:pointer-events-none`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "--tw-content": "none",
        content: "var(--tw-content)",
        paintOrder: "markers",
        ":hover": { pointerEvents: "none" },
      });
    `)
  })
})

test('using CSS variables', async () => {
  const input = 'tw`[--my-var:auto]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`({ "--my-var": "auto" });`)
  })
})

test('using underscores as spaces', async () => {
  const input = 'tw`[--my-var:2px_4px]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "--my-var": "2px 4px" });
    `)
  })
})

test('using the important modifier', async () => {
  const input = 'tw`![--my-var:2px_4px]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "--my-var": "2px 4px !important" });
    `)
  })
})

test('colons are allowed in quotes', async () => {
  const input = "tw`[content:'foo:bar']`"
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ content: "'foo:bar'" });
    `)
  })
})

test('colons are allowed in braces', async () => {
  const input = 'tw`[background-image:url(http://example.com/picture.jpg)]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ backgroundImage: "url(http://example.com/picture.jpg)" });
    `)
  })
})

test('invalid class', async () => {
  const input = 'tw`[a:b:c:d]`'
  expect.assertions(1)
  return run(input)
    .then(result => {
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      expect(error).toMatchFormattedError(`
      MacroError: unknown:
      
      ✕ [a:b:c:d] was not found`)
    })
})

test('invalid arbitrary property', async () => {
  // eslint-disable-next-line no-template-curly-in-string
  const input = 'tw`[autoplay:${autoplay}]`'
  expect.assertions(1)
  return run(input)
    .then(result => {
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      expect(error).toMatchFormattedError(`
      MacroError: unknown: 

      ✕ Your classes need to be complete strings for Twin to detect them correctly
    
      Read more at https://twinredirect.page.link/template-literals
    `)
    })
})

test('invalid arbitrary property 2', async () => {
  const input = 'tw`[0:02]`'
  return run(input)
    .then(result => {
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      expect(error).toMatchFormattedError(`
      MacroError: unknown:
      
      ✕ [0:02] was not found
    `)
    })
})

it('should be possible to read theme values in arbitrary properties (without quotes)', async () => {
  const input = 'tw`[--a:theme(colors.blue.500)] [color:var(--a)]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ "--a": "#3b82f6", color: "var(--a)" });
    `)
  })
})

it('should be possible to read theme values in arbitrary properties (with quotes)', async () => {
  const input = "tw`[color:var(--a)] [--a:theme('colors.blue.500')]`"
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ color: "var(--a)", "--a": "#3b82f6" });
    `)
  })
})

it('should not generate invalid CSS', async () => {
  const input = 'tw`[https://en.wikipedia.org/wiki]`'
  expect.assertions(1)
  return run(input)
    .then(result => {
      expect(result).toMatchFormattedJavaScript(``)
    })
    .catch(error => {
      expect(error).toMatchFormattedError(`
      MacroError: unknown:
      
      ✕ [https://en.wikipedia.org/wiki] was not found
    `)
    })
})

it('should generate seemingly invalid CSS', async () => {
  const input = 'tw`[stillworks:/example]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ stillworks: "/example" });
    `)
  })
})

it('should preserve commas', async () => {
  const input = 'tw`[path[fill="rgb(51,100,51)"]]:[fill:white]`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({ '& path[fill="rgb(51,100,51)"]': { fill: "white" } });
    `)
  })
})
