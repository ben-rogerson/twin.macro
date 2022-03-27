import tw from './macro'

// Before/after pseudo elements
tw`before:flex`
tw`after:flex`

// Interactive links/buttons
tw`hover:flex`
tw`focus:flex`
tw`active:flex`
tw`visited:flex`
tw`hocus:flex` // Twin only
tw`link:flex`
tw`target:flex`
tw`focus-visible:flex`

// Form elements
tw`file:flex`

// Form element states
tw`autofill:flex`
tw`focus-within:flex`
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
tw`not-placeholder-shown:flex`
tw`read-only:flex`
tw`read-write:flex`
tw`open:flex`
tw`not-open:flex`

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

// Media types
tw`screen:flex`
tw`print:flex`

// Group
tw`group-hocus:flex` // Twin only
tw`group-first:shadow-md`
tw`group-last:shadow-md`
tw`group-only:shadow-md`
tw`group-even:shadow-md`
tw`group-odd:shadow-md`
tw`group-first-of-type:shadow-md`
tw`group-last-of-type:shadow-md`
tw`group-only-of-type:shadow-md`
tw`group-hover:shadow-md`
tw`group-focus:shadow-md`
tw`group-disabled:shadow-md`
tw`group-active:shadow-md`
tw`group-target:shadow-md`
tw`group-visited:shadow-md`
tw`group-default:shadow-md`
tw`group-checked:shadow-md`
tw`group-indeterminate:shadow-md`
tw`group-placeholder-shown:shadow-md`
tw`group-autofill:shadow-md`
tw`group-focus-within:shadow-md`
tw`group-focus-visible:shadow-md`
tw`group-required:shadow-md`
tw`group-valid:shadow-md`
tw`group-invalid:shadow-md`
tw`group-in-range:shadow-md`
tw`group-out-of-range:shadow-md`
tw`group-read-only:shadow-md`
tw`group-empty:shadow-md`
tw`group-open:shadow-md`
tw`group-not-open:shadow-md`

// Direction
tw`rtl:shadow-md`
tw`ltr:shadow-md`

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

// Arbitrary values
tw`first:inset-[50px]`
tw`md:text-[red]`

// Random
tw`xl:placeholder-red-500! first:md:block sm:disabled:flex`
