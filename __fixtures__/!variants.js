/* eslint-disable @typescript-eslint/no-unused-vars */
import tw from './macro'

// Test all variants

tw`group-hover:flex`
tw`focus-within:flex`
tw`first:flex`
tw`last:flex`
tw`odd:flex`
tw`even:flex`
tw`hover:flex`
tw`focus:flex`
tw`active:flex`
tw`visited:flex`
tw`disabled:flex`

const multiVariants = tw`xl:placeholder-red-500! first:md:block sm:disabled:flex`

// Native to Twin

// Before/after
tw`before:content`
tw`after:content`

// Interactive links/buttons
tw`hocus:flex`
tw`link:flex`
tw`target:flex`
tw`focus-visible:flex`

// Form element states
tw`checked:flex`
tw`not-checked:flex`
tw`default:flex`
tw`enabled:flex`
tw`indeterminate:flex`
tw`invalid:flex`
tw`valid:flex`
tw`optional:flex`
tw`required:flex`
tw`placeholder-shown:flex`
tw`read-only:flex`
tw`read-write:flex`

// Not things
tw`not-first:flex`
tw`not-last:flex`
tw`not-only-child:flex`

// Only things
tw`only-child:flex`
tw`only-of-type:flex`

// Group states
tw`group-hocus:flex`
tw`group-active:flex`
tw`group-visited:flex`
