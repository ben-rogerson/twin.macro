import tw from './macro'

// Combined ring classes
tw`ring ring-inset ring-purple-500 ring-offset-black ring-offset-4 ring-opacity-50`
tw`ring ring-inset ring-purple-500 ring-offset-black ring-offset-4`
tw`ring ring-purple-500 ring-offset-black ring-offset-4`
tw`ring ring-offset-black ring-offset-4`
tw`ring ring-offset-4`

// Test the ring-opacity ordering - 'ring-opacity-x' should be moved to the end
// https://github.com/ben-rogerson/twin.macro/issues/374
tw`ring-4 ring-opacity-20 ring-green-500`
tw`mt-5 md:(ring-opacity-20 ring-4 ring-green-500) mb-5`

tw`ring-[10px]`
