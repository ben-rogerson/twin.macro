import tw from './macro'

// Test the screen ordering - they are ordered by screens in tailwind.config.js
tw.div`xl:bg-red-500 lg:bg-blue-500 bg-green-500 fill-current md:bg-pink-500 sm:bg-green-500 sm:text-yellow-500 hidden`

// Bg opacity should trump the default bg opacity
tw`bg-opacity-50 bg-red-500`
