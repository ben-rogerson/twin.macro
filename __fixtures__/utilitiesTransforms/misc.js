import tw from './macro'

// Test the transform ordering - 'transform' should be moved to the start
// https://github.com/ben-rogerson/twin.macro/issues/363
tw`mt-5 translate-y-2 transform`
tw`translate-y-2 mt-5 md:(skew-y-6 transform) mb-5`
