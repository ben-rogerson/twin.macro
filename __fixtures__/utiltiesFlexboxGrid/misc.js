import tw from './macro'

// col-span-x should always be moved to the start
// https://github.com/ben-rogerson/twin.macro/issues/363
tw`col-start-3 col-span-3`
tw`col-span-3 col-start-3`
tw`col-end-3 col-span-3`
tw`col-span-3 col-end-3`
tw`col-start-3 col-end-3 col-span-3`
tw`col-span-3 col-start-3 col-end-3`
tw`grid col-span-3`
tw`grid col-start-3 col-end-3`
tw`col-start-3 col-span-3 col-end-3 grid`
tw`col-start-3 mt-4 md:(mt-3 col-span-3) mb-4 col-end-3 col-span-3`
