/// <reference types="styled-components/cssprop" />
import React from 'react'
import styled from 'styled-components'
import tw from '../..'

export const ComponentAsSelector = styled.div(() => [tw`block`])

export const Container = styled.div`
  ${tw`flex flex-col w-full max-w-sm`}
  & > form {
    ${tw`w-full`}
  }
  ${ComponentAsSelector}:hover {
    ${tw`bg-blue-500 text-gray-100`}
    color: red;
  }
`

export const Link = tw.a``
export const ComposedLink = tw(Link)``
export const ComposedLink2 = styled(Link)``

export const cssProperty = <div css={tw`bg-red-100`} />
export const csProperty = <div cs="maxWidth[100%] height[calc(100vh - 1em)]" />

export const asProperty = <Link as="button" />
export const asProperty2 = <Container as="button" />
