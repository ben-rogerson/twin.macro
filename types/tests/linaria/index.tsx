import { styled } from 'linaria/react'
import { css } from 'linaria'
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

export const cssProperty = (
  <div
    className={css`
      ${tw`bg-red-100`}
    `}
  />
)
