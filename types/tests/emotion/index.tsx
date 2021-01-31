/// <reference types="@emotion/react/types/css-prop" />
// this also works:
// import {} from '@emotion/react/types/css-prop'

import {} from '@emotion/react'
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
export const ComposedLink = tw(Link)``
export const ComposedLink2 = styled(Link)``

export const cssProperty = <div css={tw`bg-red-100`} />
export const csProperty = <div cs="maxWidth[100%] height[calc(100vh - 1em)]" />
