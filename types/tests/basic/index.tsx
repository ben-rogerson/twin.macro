/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import tw from '../..'

tw`text-gray-100 bg-blue-500`

// basic variables
const basic = 'bg-blue-500'
tw`${basic}`

// @ts-expect-error
tw('')

// @ts-expect-error
tw`interpolations not supported ${123}`

const Button = tw.button`bg-blue-500 text-gray-100`
const A = tw.a`bg-blue-500 text-gray-100`
const P = tw.p`bg-blue-500 text-gray-100`
const Img = tw.img`bg-blue-500 text-gray-100`

const jsx = (
  <>
    <Button type="button">press me</Button>
    <A href="https://google.com" />
    <P>ay</P>
    <Img src="..." />
  </>
)

// @ts-expect-error
const badJsx = <Button what="lol" />

// @ts-expect-error
tw.nonexistentelement`` /* eslint-disable-line @typescript-eslint/no-unsafe-call */

// @ts-expect-error
tw('call syntax not supported')``

const App = ({
  children,
}: {
  readonly children: React.ReactNode
}): React.ReactElement => {
  return <p>{children}</p>
}

const twProperty = (
  <App tw="prop">
    <div tw="prop">cool</div>
  </App>
)
