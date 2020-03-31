import {} from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import tw from '..'

export const Container = styled.div`
  ${tw`flex flex-col w-full max-w-sm`}
  & > form {
    ${tw`w-full`}
  }
`

export const cssProp = <div css={tw`bg-red-100`} />
