import tw from './macro'

// Test the transition ordering - 'transition' should be moved to the start
// https://github.com/ben-rogerson/twin.macro/issues/363
tw`duration-75 ease-in transition`
tw`mt-5 md:(ml-5 ease-in transition) mb-5`
