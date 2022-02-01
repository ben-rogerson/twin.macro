import tw from './macro'

const basic = tw`group-hover:(flex m-10)`
const subMediaQuery = tw`focus-within:(md:flex mt-5)`
const multipleClasses = tw`hover:(bg-black text-white underline)`
const pseudoElement = tw`before:(w-10 h-10 block bg-black)`
const pseudoElementNoContent = tw`before:(w-10 h-10 block bg-black)`
const pseudoElementsNoContent = tw`before:(w-10 h-10) after:(w-10 h-10)`
const mediaHover = tw`sm:hover:(bg-black text-white)`
const sloppySpacing = tw` last:( flex  mt-5)`
const multipleGroups = tw`focus:(w-10 h-10 block bg-black) focus-within:(md:flex mt-5)`
const nestedGroups = tw`md:(w-10 hocus:(h-10 block bg-black))`

tw`(block w-10)`
tw`((block w-10))`
tw`hover:(block w-10)`
tw`md:(hover:(block w-10))`
tw`md:(hover:(block (block) w-10))`
tw`md:(hover:(block (h-10) w-10))`

// Important
tw`(block w-10)!`
tw`hover:(block w-10)!`
tw`md:(hover:(block (block)! w-10))`
tw`md:(hover:(block (h-10)! w-10))`
tw`md:(hover:(block w-10)!)`

// Ignored
tw``
tw`()`
tw`md:()`
tw`md:(hover:())`

// Slash opacity
tw`first:(bg-[black]/20 block)`
tw`first:(bg-[black]/[.20] block)`
tw`first:(bg-[black]/[.20] inline last:(bg-[black]/[.20] block))`
tw`first:(block bg-[black]/[.20])`
