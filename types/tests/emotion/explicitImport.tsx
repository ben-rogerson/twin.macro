import {} from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import tw from '../..'

export const Container = styled.div`
  ${tw`flex flex-col w-full max-w-sm`}
  & > form {
    ${tw`w-full`}
  }
`

export const Link = tw.a``
export const ComposedLink = styled(Link)``

export const cssProperty = <div css={tw`bg-red-100`} />
