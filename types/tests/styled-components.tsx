import styled from 'styled-components'
import tw from '..'

export const Container = styled.div`
  ${tw`flex flex-col w-full max-w-sm`}
  & > form {
    ${tw`w-full`}
  }
`

export const Link = tw.a``
export const ComposedLink = styled(Link)``

// I want to test the styled-components css prop in isolation from the emotion css prop,
// but I dunno how to do that
// export const cssProp = <div css={tw`bg-red-100`} />
