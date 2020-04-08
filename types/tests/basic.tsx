import React from 'react'
import tw from '..'

tw`text-gray-100 bg-blue-500`

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
tw.nonexistentelement``

// @ts-expect-error
tw('call syntax not supported')``

function App({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>
}

const twProp = (
  <App tw="prop">
    <div tw="prop">cool</div>
  </App>
)
