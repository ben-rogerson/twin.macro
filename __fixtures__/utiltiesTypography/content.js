import tw, { theme } from './macro'

// https://tailwindcss.com/docs/content
theme`content`

tw`content-none`

tw`content-['hello']`
tw`content-[attr(content-before)]`
tw`before:content-[attr(content-before)]`
