import tw, { theme, styled, css, GlobalStyles } from './macro'

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

const themeObjectPurple = (
  <input css={css({ color: theme`colors.purple.500` })} />
)

const themeStringFont = (
  <input
    css={css`
      font-family: ${theme`fontFamily.sans`};
    `}
  />
)

const themeFontNoLineheight = (
  <input
    css={css`
      outline: ${theme`fontSize.sm`};
    `}
  />
)

const colorsRed = Object.values(theme`colors.red`)

const themeFunctionObjectPurple = (
  <input css={css({ color: theme('colors.black') })} />
)

const themeFunctionStringHeight = (
  <input
    css={css`
      height: ${theme('height.24')};
    `}
  />
)

const themeSquareBrackets = (
  <input
    css={css`
      height: ${theme('spacing[2.5]')};
    `}
  />
)

const GlobalStylesTest = () => <GlobalStyles />

// Dot syntax
const Component = { Sub: () => [] }
;<Component.Sub css={tw`fixed`} />
;<Component.Sub tw="fixed" />
