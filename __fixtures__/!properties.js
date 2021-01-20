import tw from './macro'

const Component1 = () => <div tw="uppercase" />

const Component2 = () => <div css={{ display: 'flex' }} tw="uppercase" />

const Component3 = () => <div css={[{ display: 'flex' }]} tw="uppercase" />

const Component4 = () => <div tw="uppercase" css={[tw`flex`]} />

const Component5 = () => <div css={[tw`flex`]} tw="uppercase" />

const Component6 = () => (
  <div
    tw="uppercase"
    css={`
      color: red;
    `}
  />
)

const Component7 = () => (
  <div
    css={`
      color: red;
    `}
    tw="uppercase"
  />
)
