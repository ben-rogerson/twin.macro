import tw, { theme } from './macro'

// https://tailwindcss.com/docs/content
theme`content`

tw`content`
tw`content-test`
tw`content-['hello']`
tw`content-[attr(content-before)]`
tw`content-['>']`
tw`content-none`
tw`before:block`
tw`peer-focus:before:block`
