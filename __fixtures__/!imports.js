/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import tw, { styled, css } from './macro'

const twPropertyTest = <div tw="text-purple-500" />

const twFunctionTest = tw.div`text-purple-500`

const cssFunctionTest = (
  <div
    css={css`
      ${tw`text-purple-500`}
      background-color: purple;
    `}
  />
)

const styledFunctionTest = styled.div`
  ${css`
    ${tw`text-purple-500`}
    background-color: purple;
  `}
`
