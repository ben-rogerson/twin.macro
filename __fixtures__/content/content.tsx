// @ts-nocheck
import tw, { theme } from './macro'

// https://tailwindcss.com/docs/content
theme`content`

tw`content`
tw`content-test`
tw`content-['hello']`
tw`content-[attr(content-before)]`
tw`content-['>']`
tw`content-['—']`
tw`before:content-['—']`
tw`before:(content-['—'] block)`
tw`content-none`
tw`before:block`
tw`peer-focus:before:block`
