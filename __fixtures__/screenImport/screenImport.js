import tw, { styled, screen } from './macro'

// Media query only
screen`sm`
screen.md // Can't work with screen values that begin with a number, eg: screen.2xl
screen('lg')
screen(`xl`)

// Constructed media queries
;`
    ${screen`sm`} {
        display: block;
        ${tw`inline`}
    }
`
;({ [screen`sm`]: `display: block; ${tw`inline`}` })
;({ [screen`sm`]: { display: 'block', ...tw`inline` } })

// Media queries with styles
screen.sm({ color: `red` })
screen`md`({ color: `red` })
screen('lg')({ color: `red` })
screen(`xl`)({ color: `red` })
screen.sm`color: red;`
screen`md``color: red;`
screen('lg')`color: red;`
screen(`xl`)`color: red;`

screen.xl(tw`inline`)
screen.xl({ ...tw`inline` })
screen.xl({ ...tw`inline`, display: 'block' })
screen.xl`
    ${tw`inline`}
    display: block;
`
screen.xl`color: ${true && 'blue'};`

// Within template literals
;`${screen.lg}`
;`${screen`xl`}`
;`${screen(`xl`)}`
;`${screen('xl')}`

// Screen keys
;<div
  css={{
    [screen.xl]: { color: 'red' },
  }}
/>
;<div
  css={`
    ${{ [screen.xl]: { color: 'red' } }}
  `}
/>
;<div css={[{ [screen.xl]: { color: 'red' } }]} />
;<div
  css={`
    ${screen.xl} {
      color: red;
    }
  `}
/>

styled.div`
  ${{ [screen.xl]: { color: 'red' } }}
`
styled.div([{ [screen.xl]: { color: 'red' } }])

// Logical expressions
;<div
  css={{
    [true && screen.xl]: { color: 'red' },
  }}
/>
styled.div([{ [true && screen.xl]: { color: 'red' } }])

// Conditional expressions
;<div
  css={{
    // eslint-disable-next-line no-constant-condition
    [true ? screen.xl : screen.sm]: { color: 'red' },
  }}
/>
styled.div`
  ${{
    // eslint-disable-next-line no-constant-condition
    [true ? screen.xl : screen.sm]: { color: 'red' },
  }}
`

// Screen with values
;<div css={screen.xl({ color: 'red' })} />
;<div css={[screen.xl({ color: 'red' })]} />
;<div
  css={`
    ${screen.xl({ color: 'red' })}
  `}
/>
;<div css={screen.xl`color: red;`} />
;<div css={[screen.xl`color: red;`]} />
;<div
  css={`
    ${screen.xl`color: red;`}
  `}
/>
