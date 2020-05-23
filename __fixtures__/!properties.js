/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import tw from './macro'

const Component1 = () => <div tw="uppercase" />

const Component2 = () => <div css={{ display: 'flex' }} tw="uppercase" />

const Component3 = () => <div css={[{ display: 'flex' }]} tw="uppercase" />
