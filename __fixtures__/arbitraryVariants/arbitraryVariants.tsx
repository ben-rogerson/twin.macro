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
