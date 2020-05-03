import tw from './macro'

// Test all variants

tw`group-hover:bg-red-500`
tw`focus-within:bg-red-500`
tw`first:bg-red-500`
tw`last:bg-red-500`
tw`odd:bg-red-500`
tw`even:bg-red-500`
tw`hover:bg-red-500`
tw`focus:bg-red-500`
tw`active:bg-red-500`
tw`visited:bg-red-500`
tw`disabled:bg-red-500`

const multiVariants = tw`xl:placeholder-bg-red-500! first:md:block sm:disabled:bg-red-500`

// Native to Twin

tw`hocus:bg-red-500`
tw`before:bg-red-500`
tw`after:bg-red-500`
tw`checked:bg-red-500`
