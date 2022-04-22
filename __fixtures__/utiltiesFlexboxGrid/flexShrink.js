import tw, { theme } from './macro'

// https://tailwindcss.com/docs/flex-shrink
theme`flexShrink.`

tw`shrink-0`
tw`shrink`
tw`flex-shrink-0` // Deprecated
tw`flex-shrink` // Deprecated

tw`flex-shrink-[var(--shrink)]` // Deprecated
tw`shrink-[var(--shrink)]`
