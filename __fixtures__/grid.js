import tw from './macro'

// https://tailwindcss.com/docs/grid-template-columns
tw`grid-cols-1`
tw`grid-cols-2`
tw`grid-cols-3`
tw`grid-cols-4`
tw`grid-cols-5`
tw`grid-cols-6`
tw`grid-cols-7`
tw`grid-cols-8`
tw`grid-cols-9`
tw`grid-cols-10`
tw`grid-cols-11`
tw`grid-cols-12`
tw`grid-cols-none`

// https://tailwindcss.com/docs/grid-column
tw`col-auto`
tw`col-span-1`
tw`col-span-2`
tw`col-span-3`
tw`col-span-4`
tw`col-span-5`
tw`col-span-6`
tw`col-span-7`
tw`col-span-8`
tw`col-span-9`
tw`col-span-10`
tw`col-span-11`
tw`col-span-12`
tw`col-span-full`
tw`col-start-1`
tw`col-start-2`
tw`col-start-3`
tw`col-start-4`
tw`col-start-5`
tw`col-start-6`
tw`col-start-7`
tw`col-start-8`
tw`col-start-9`
tw`col-start-10`
tw`col-start-11`
tw`col-start-12`
tw`col-start-13`
tw`col-start-auto`
tw`col-end-1`
tw`col-end-2`
tw`col-end-3`
tw`col-end-4`
tw`col-end-5`
tw`col-end-6`
tw`col-end-7`
tw`col-end-8`
tw`col-end-9`
tw`col-end-10`
tw`col-end-11`
tw`col-end-12`
tw`col-end-13`
tw`col-end-auto`

// col-span-x should always be moved to the start
// https://github.com/ben-rogerson/twin.macro/issues/363
tw`col-start-3 col-span-3`
tw`col-span-3 col-start-3`
tw`col-end-3 col-span-3`
tw`col-span-3 col-end-3`
tw`col-start-3 col-end-3 col-span-3`
tw`col-span-3 col-start-3 col-end-3`
tw`grid col-span-3`
tw`grid col-start-3 col-end-3`
tw`col-start-3 col-span-3 col-end-3 grid`
tw`col-start-3 mt-4 md:(mt-3 col-span-3) mb-4 col-end-3 col-span-3`

// https://tailwindcss.com/docs/grid-template-rows
tw`grid-rows-1`
tw`grid-rows-2`
tw`grid-rows-3`
tw`grid-rows-4`
tw`grid-rows-5`
tw`grid-rows-6`
tw`grid-rows-none`

// https://tailwindcss.com/docs/grid-row
tw`row-auto`
tw`row-span-1`
tw`row-span-2`
tw`row-span-3`
tw`row-span-4`
tw`row-span-5`
tw`row-span-6`
tw`row-span-full`
tw`row-start-1`
tw`row-start-2`
tw`row-start-3`
tw`row-start-4`
tw`row-start-5`
tw`row-start-6`
tw`row-start-7`
tw`row-start-auto`
tw`row-end-1`
tw`row-end-2`
tw`row-end-3`
tw`row-end-4`
tw`row-end-5`
tw`row-end-6`
tw`row-end-7`
tw`row-end-auto`

// https://tailwindcss.com/docs/grid-auto-flow
tw`grid-flow-row`
tw`grid-flow-col`
tw`grid-flow-row-dense`
tw`grid-flow-col-dense`

// https://tailwindcss.com/docs/grid-auto-columns
tw`auto-cols-auto`
tw`auto-cols-min`
tw`auto-cols-max`
tw`auto-cols-fr`

// https://tailwindcss.com/docs/grid-auto-rows
tw`auto-rows-auto`
tw`auto-rows-min`
tw`auto-rows-max`
tw`auto-rows-fr`

// https://tailwindcss.com/docs/gap
tw`gap-0`
tw`gap-0.5`
tw`gap-1`
tw`gap-1.5`
tw`gap-2`
tw`gap-2.5`
tw`gap-3`
tw`gap-3.5`
tw`gap-4`
tw`gap-5`
tw`gap-6`
tw`gap-7`
tw`gap-8`
tw`gap-9`
tw`gap-10`
tw`gap-12`
tw`gap-14`
tw`gap-16`
tw`gap-20`
tw`gap-24`
tw`gap-28`
tw`gap-32`
tw`gap-36`
tw`gap-40`
tw`gap-44`
tw`gap-48`
tw`gap-52`
tw`gap-56`
tw`gap-60`
tw`gap-64`
tw`gap-72`
tw`gap-80`
tw`gap-96`
tw`gap-px`

// https://tailwindcss.com/docs/gap
tw`gap-x-0`
tw`gap-x-0.5`
tw`gap-x-1`
tw`gap-x-1.5`
tw`gap-x-2`
tw`gap-x-2.5`
tw`gap-x-3`
tw`gap-x-3.5`
tw`gap-x-4`
tw`gap-x-5`
tw`gap-x-6`
tw`gap-x-8`
tw`gap-x-10`
tw`gap-x-12`
tw`gap-x-16`
tw`gap-x-20`
tw`gap-x-24`
tw`gap-x-32`
tw`gap-x-40`
tw`gap-x-48`
tw`gap-x-56`
tw`gap-x-64`
tw`gap-x-px`

// https://tailwindcss.com/docs/gap
tw`gap-y-0`
tw`gap-y-0.5`
tw`gap-y-1`
tw`gap-y-1.5`
tw`gap-y-2`
tw`gap-y-2.5`
tw`gap-y-3`
tw`gap-y-3.5`
tw`gap-y-4`
tw`gap-y-5`
tw`gap-y-6`
tw`gap-y-7`
tw`gap-y-8`
tw`gap-y-9`
tw`gap-y-10`
tw`gap-y-11`
tw`gap-y-12`
tw`gap-y-16`
tw`gap-y-20`
tw`gap-y-24`
tw`gap-y-28`
tw`gap-y-32`
tw`gap-y-36`
tw`gap-y-40`
tw`gap-y-44`
tw`gap-y-48`
tw`gap-y-52`
tw`gap-y-56`
tw`gap-y-60`
tw`gap-y-64`
tw`gap-y-72`
tw`gap-y-80`
tw`gap-y-96`
tw`gap-y-px`
