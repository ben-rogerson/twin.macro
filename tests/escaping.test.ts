import { run } from './util/run'

test('removes newline and tab escape characters', async () => {
  const input = 'tw`\tm-0\tinline\n`'
  return run(input).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        'margin': '0px',
        'display': 'inline'
      });
    `)
  })
})
