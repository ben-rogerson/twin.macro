import tw from './macro'

tw`bg-[#0f0] bg-[#ff0000] bg-[#0000ffcc]`
tw`bg-[#0000ffcc]`
tw`bg-[rgb(123,123,123)] bg-[rgba(123,123,123,0.5)]`
tw`bg-[hsl(0,100%,50%)] bg-[hsla(0,100%,50%,0.3)]`
tw`bg-opacity-[0.11]`
tw`bg-opacity-[var(--value)]`
tw`border-[#f00]`
tw`border-[2.5px]`
tw`border-t-[#f00]`
tw`border-t-[2.5px]`
tw`w-[3.23rem]`
tw`w-[calc(100%+1rem)]`
tw`w-[calc(var(--10-10px,calc(-20px-(-30px--40px)))-50px)]`
tw`w-[var(--width)]`
tw`w-[var(--width,calc(100%+1rem))]`
tw`w-[calc(100%/3-1rem*2)]`
tw`min-w-[3.23rem]`
tw`min-w-[calc(100%+1rem)]`
tw`min-w-[var(--width)]`
tw`max-w-[3.23rem]`
tw`max-w-[calc(100%+1rem)]`
tw`max-w-[var(--width)]`
tw`h-[3.23rem]`
tw`h-[calc(100%+1rem)]`
tw`h-[var(--height)]`
tw`min-h-[3.23rem]`
tw`min-h-[calc(100%+1rem)]`
tw`min-h-[var(--height)]`
tw`max-h-[3.23rem]`
tw`max-h-[calc(100%+1rem)]`
tw`max-h-[var(--height)]`
tw`space-x-[20cm]`
tw`space-x-[calc(20%-1cm)]`
tw`grid-cols-[200px,repeat(auto-fill,minmax(15%,100px)),300px]`
tw`lg:grid-cols-[200px,repeat(auto-fill,minmax(15%,100px)),300px]`
tw`grid-rows-[200px,repeat(auto-fill,minmax(15%,100px)),300px]`
tw`col-[7]`
tw`col-end-[7]`
tw`col-start-[7]`
tw`flex-[var(--flex)]`
tw`flex-grow-[var(--grow)]`
tw`flex-shrink-[var(--shrink)]`
tw`row-[7]`
tw`row-end-[7]`
tw`row-start-[7]`
tw`rotate-[23deg] rotate-[2.3rad] rotate-[401grad] rotate-[1.5turn]`
tw`skew-x-[3px]`
tw`skew-y-[3px]`
tw`text-[2.23rem]`
tw`text-[length:var(--font-size)]`
tw`text-[color:var(--color)]`
// tw`text-[angle:var(--angle)]` // unsupported (text doesnt have an angle)
tw`duration-[2s]`
tw`m-[7px]`
tw`mx-[7px]`
tw`my-[7px]`
tw`mt-[7px]`
tw`mr-[7px]`
tw`mb-[7px]`
tw`ml-[7px]`
tw`mt-[clamp(30px,100px)]`
tw`rounded-[11px]`
tw`rounded-t-[var(--radius)] rounded-r-[var(--radius)] rounded-b-[var(--radius)] rounded-l-[var(--radius)]`
tw`rounded-tr-[var(--radius)] rounded-br-[var(--radius)] rounded-bl-[var(--radius)] rounded-tl-[var(--radius)]`
tw`duration-[var(--app-duration)]`
tw`p-[var(--app-padding)]`
tw`inset-[11px]`
tw`blur-[15px]`
tw`brightness-[300%]`
tw`contrast-[2.4]`
tw`grayscale-[0.55]`
tw`hue-rotate-[0.8turn]`
tw`invert-[0.75]`
tw`saturate-[180%]`
tw`sepia-[0.2]`
tw`backdrop-blur-[11px]`
tw`backdrop-brightness-[1.23]`
tw`backdrop-contrast-[0.87]`
tw`backdrop-grayscale-[0.42]`
tw`backdrop-hue-rotate-[1.57rad]`
tw`backdrop-invert-[0.66]`
tw`backdrop-opacity-[22%]`
tw`backdrop-saturate-[144%]`
tw`backdrop-sepia-[0.38]`
tw`from-[#da5b66] via-[#da5b66] to-[#da5b66]`
tw`from-[var(--color)] via-[var(--color)] to-[var(--color)]`
tw`fill-[#da5b66]`
tw`fill-[var(--color)]`
tw`object-[var(--position)]`
tw`stroke-[#da5b66]`
tw`leading-[var(--leading)]`
tw`tracking-[var(--tracking)]`
tw`-tracking-[var(--tracking)]`
tw`-tracking-[2em]`
tw`placeholder-[var(--placeholder)]`
tw`placeholder-opacity-[var(--placeholder-opacity)]`
tw`opacity-[var(--opacity)]`
tw`outline-[var(--outline)]`
tw`ring-[#76ad65]`
tw`ring-offset-[#76ad65]`
tw`ring-[10px]`
tw`ring-offset-[#ad672f]`
tw`ring-offset-[19rem]`
tw`ring-opacity-[var(--ring-opacity)]`
tw`delay-[var(--delay)]`
tw`content-['hello']`
tw`content-[attr(content-before)]`

// Important
tw`inset-[50px]!`
tw`text-[red]!`

// Variants
tw`first:inset-[50px]`
tw`md:text-[red]`
