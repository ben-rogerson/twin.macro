import { run } from './util/run'

it('errors with extra dividers between variants', async () => {
  const input = 'tw`[&_.test]::block`'
  return run(input).catch(error => {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(error).toMatchFormattedError(`
      MacroError: unknown:

      ✕ [&_.test]::block has too many dividers
    `)
  })
})

it('errors with an extra divider after the class', async () => {
  const input = 'tw`[&_.test]:block:`'
  return run(input).catch(error => {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(error).toMatchFormattedError(`
      MacroError: unknown:

      ✕ The variant [&_.test]:block: doesn’t look right
    `)
  })
})
