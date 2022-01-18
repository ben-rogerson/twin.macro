import tw, { theme } from './macro'

// https://tailwindcss.com/docs/grid-auto-columns
theme`gridAutoColumns`

tw`auto-cols-auto`
tw`auto-cols-min`
tw`auto-cols-max`
tw`auto-cols-fr`

tw`auto-cols-[minmax(0, 2fr)]`
tw`grid-cols-[200px,repeat(auto-fill,minmax(15%,100px)),300px]`
tw`lg:grid-cols-[200px,repeat(auto-fill,minmax(15%,100px)),300px]`
