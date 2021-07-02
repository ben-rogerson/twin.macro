import tw, { styled } from './macro'

tw.div`block`
styled.div(tw`block`)
styled.div({ display: 'block' })

// Classic syntax
styled('div', tw`block`)
