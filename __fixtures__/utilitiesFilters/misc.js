import tw, { theme } from './macro'

// https://tailwindcss.com/docs/filter
tw`filter-none`
tw`filter` // Deprecated

// https://tailwindcss.com/docs/backdrop-filter
tw`backdrop-filter` // Deprecated
tw`backdrop-filter-none`

// All
tw`filter blur-2xl brightness-50 contrast-50 grayscale hue-rotate-180 invert saturate-50 sepia drop-shadow-2xl`

// All
tw`backdrop-filter backdrop-blur-2xl backdrop-brightness-50 backdrop-contrast-50 backdrop-grayscale backdrop-hue-rotate-180 backdrop-invert backdrop-opacity-50 backdrop-saturate-50 backdrop-sepia`
