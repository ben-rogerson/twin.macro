import React from 'react'
import tw from '..'

tw`text-gray-100 bg-blue-500`

// @ts-expect-error
tw('')

// @ts-expect-error
tw`interpolations not supported ${123}`

tw.button`bg-blue-500 text-gray-100`
tw.a`bg-blue-500 text-gray-100`
tw.p`bg-blue-500 text-gray-100`
tw.img`bg-blue-500 text-gray-100`

// @ts-expect-error
tw.nonexistentelement``

// @ts-expect-error
tw('call syntax not supported')``

function App() {
  return <p>hi</p>
}

const twPropElement = <div tw="prop" />
const twPropComponent = <App tw="prop" />
