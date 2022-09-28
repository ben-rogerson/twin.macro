// @ts-nocheck
import tw from './macro'

tw`[section]:hover:block`

tw`[p]:hover:block`
tw`hover:[p]:block`

tw`[* + *]:block` // Spaces
tw`[.class1 .class2]:block` // Classes

tw`[.class1]:[.class2]:block` // Multiple dynamic variants
tw`[.class1 .class2]:[.class3]:block` // Multiple dynamic variants

tw`[p]:placeholder-red-500/[var(--myvar)]`
tw`[p]:mt-[var(--myvar)]`
tw`[p]:marginTop[var(--myvar)]`
tw`[p]:[margin-top:var(--myvar)]`

tw`[p]:(mt-4 mb-4)`

tw`[@media (min-width: 800px)]:block`
tw`[content\\!]:block`

// Combinations
tw`[&:nth-child(1)]:block`
tw`[:nth-child(1)]:block`
tw`[@media ...]:block`
tw`[.selector]:block`
tw`[section]:block`
tw`[section &]:block`
tw`md:[section]:block`
tw`[section]:[bla]:block`
tw`[section &]:[pre &]:block`
tw`[section &]:[& pre]:block`
tw`[section &]:first:[pre &]:block`
tw`[section &]:first:[& pre]:block`
tw`first:[section &]:[pre &]:block`
tw`first:[section &]:[& pre]:block`
tw`first:[section &]:[& pre]:mt-[2px]`
tw`first:[section &]:[& pre]:[display:inline]`
tw`[pre]:[display:inline]`
tw`[& pre]:[display:inline]`
tw`[:hover]:[display:inline]`
tw`[.dropdown.dropdown-open &, .dropdown:focus &]:block`
tw`[path]:first:[stroke: #000] md:[path]:[stroke: #000]`
tw`first:block md:[path]:[stroke: #000]`
tw`[.sec section a[target="_blank"]]:block` // < issue with _blank present in tailwindcss
tw`[#blah, &.pre, & section,]:block`
tw`[&.pre,& section,]:block`

tw`[&>*]:underline`
tw`[.a.b_&]:underline`
tw`dark:lg:hover:[&>*]:underline`
tw`[div]:underline`
tw`[:hover]:underline`
tw`[wtf-bbq]:underline`
tw`[lol]:hover:underline`
tw`underline lg:underline [&>*]:underline`
tw`[@supports(what:ever)]:underline`
tw`[@media_screen{@media(hover:hover)}]:underline`
tw`[@media(hover:hover){&:hover}]:underline`
tw`[&[data-open]]:underline`
//..
tw`[&_.foo\\_\\_bar]:underline`
tw`[&_.foo\\_\\_bar]:[&_.bar\\_\\_baz]:underline`
tw`[&_.foo\\_\\_bar]:hover:underline`
tw`hover:[&_.foo\\_\\_bar]:underline`
tw`[&[data-test='2']]:underline`
