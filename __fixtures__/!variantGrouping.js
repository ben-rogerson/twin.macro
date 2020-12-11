/* eslint-disable @typescript-eslint/no-unused-vars */
import tw from './macro'

const basic = tw`group-hover:(flex m-10)`
const subMediaQuery = tw`focus-within:(md:flex mt-5)`
const multipleClasses = tw`hover:(bg-black text-white underline)`
const pseudoElement = tw`before:(content w-10 h-10 block bg-black)`
const mediaHover = tw`sm:hover:(bg-black text-white)`
const sloppySpacing = tw` last:( flex  mt-5)`
const multipleGroups = tw`focus:(w-10 h-10 block bg-black) focus-within:(md:flex mt-5)`
const nestedGroups = tw`md:(w-10 hocus:(h-10 block bg-black))`
