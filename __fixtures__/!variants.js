import tw from './macro'

// Before/after pseudo elements
tw`before:content`
tw`after:content`

// Interactive links/buttons
tw`hover:flex`
tw`focus:flex`
tw`active:flex`
tw`visited:flex`
tw`hocus:flex`
tw`link:flex`
tw`target:flex`
tw`focus-visible:flex`

// Form element states
tw`autofill:flex`
tw`disabled:flex`
tw`checked:flex`
tw`not-checked:flex`
tw`default:flex`
tw`enabled:flex`
tw`indeterminate:flex`
tw`in-range:flex`
tw`invalid:flex`
tw`valid:flex`
tw`optional:flex`
tw`out-of-range:flex`
tw`required:flex`
tw`placeholder:flex`
tw`placeholder-shown:flex`
tw`read-only:flex`
tw`read-write:flex`

// Child selectors
tw`not-disabled:flex`
tw`first-of-type:flex`
tw`not-first-of-type:flex`
tw`last-of-type:flex`
tw`not-last-of-type:flex`
tw`first-letter:flex`
tw`first-line:flex`
tw`first:flex`
tw`not-first:flex`
tw`last:flex`
tw`not-last:flex`
tw`only:flex`
tw`not-only:flex`
tw`only-of-type:flex`
tw`not-only-of-type:flex`
tw`even:flex`
tw`odd:flex`
tw`odd-of-type:flex`
tw`even-of-type:flex`
tw`svg:flex`
tw`all:flex`
tw`all-child:flex`
tw`sibling:flex`

// Content
tw`empty:flex`

// Group states
tw`group-hover:flex`
tw`group-focus:flex`
tw`group-hocus:flex`
tw`group-active:flex`
tw`group-visited:flex`
tw`focus-within:flex`

// Media types
tw`screen:flex`
tw`print:flex`

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
tw`motion-safe:flex`
tw`motion-reduce:flex`

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
tw`any-pointer-none:flex`
tw`any-pointer-fine:flex`
tw`any-pointer-coarse:flex`

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
tw`pointer-none:flex`
tw`pointer-fine:flex`
tw`pointer-coarse:flex`

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover
tw`any-hover-none:flex`
tw`any-hover:flex`

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
tw`can-hover:flex`
tw`cant-hover:flex`

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation
tw`landscape:flex`
tw`portrait:flex`

// Dark/Light themes
tw`dark:bg-black`
tw`light:bg-black`
tw`dark:sm:bg-black`
tw`light:sm:bg-black`
tw`dark:group-hover:sm:bg-black`
tw`light:group-hocus:sm:bg-black`

// Selection
tw`selection:bg-black`

// Lists
tw`marker:bg-black`

const multiVariants = tw`xl:placeholder-red-500! first:md:block sm:disabled:flex`
