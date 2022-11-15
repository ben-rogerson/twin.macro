import { run } from './util/run'

test('removes newline and tab escape characters', async () => {
  const input = 'tw`\tm-0\tinline\n`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "margin": "0px",
        "display": "inline"
      });
    `)
  })
})

test('the number of backslashes are preserved', async () => {
  const input = "tw`content-['\\a0']`"
  return run(input).then(result => {
    // We have to double escape the backslashes below - it's actually `"'\\a0'"`
    expect(result).toMatchFormattedJavaScript(`
    ({ "--tw-content": "'\\\\a0'", content: "var(--tw-content)" });
    `)
  })
})

test('media commas in media queries are preserved', async () => {
  const input =
    'tw`[@media (min-width: 700px),, (min-width: 700px), and (orientation: landscape)]:block`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "@media (min-width: 700px), , (min-width: 700px), and (orientation: landscape)": {
          "display": "block",
        }
      });
    `)
  })
})
