import React from 'react'
import tw from '../..'

// standard template literal
tw`text-gray-100 bg-blue-500`

// basic variables
const basic = 'bg-blue-500'
tw`${basic}`

// @ts-expect-error empty tw
tw('')

// @ts-expect-error interpolations not supported
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

// @ts-expect-error bad jsx
const badJsx = <Button what="bad-jsx" />

// @ts-expect-error non-existent element
tw.nonExistentElement``

// @ts-expect-error call syntax not supported
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
    <div tw="prop">prop</div>
  </App>
)

const csProperty = <div cs="maxWidth[100%] height[calc(100vh - 1em)]" />
const asProperty = <Button as="div" />

// @ts-expect-error basic element doesn't provide as prop
const asPropertyError = <p as="div" />
