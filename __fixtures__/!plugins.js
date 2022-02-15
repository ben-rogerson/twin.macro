import tw from './macro'

// Tailwind plugin tests

tw`type-sm`

const addUtilitiesTest = tw`type-sm text-red-500 lg:type-sm md:type-sm!`

const addUtilitiesTest2 = tw`skew-15deg`
const addUtilitiesTest2Important = tw`skew-15deg! type-sm!`
const addUtilitiesTest2Media = tw`sm:skew-15deg lg:type-sm`
const addUtilitiesTest2Variants = tw`hover:active:skew-15deg even:visited:skew-15deg`

const addComponentsTest = tw`btn btn-blue btn-red`
// const addComponentsTestImportant = tw`btn! btn-blue!` // TODO: Issue showing sub selectors and important
const addComponentsTestMedia = tw`xl:btn sm:btn-blue lg:btn-red`
const addComponentsTestVariants = tw`hover:active:btn hocus:before:btn-blue even:visited:btn-red`

const addComponentsTestElementPrefixes = tw`prefixes`
const addComponentsTestElementScreenReplacements = tw`screenies`
