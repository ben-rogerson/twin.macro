import tw from './macro'

// within cs prop
;<div cs="maxWidth[100vw - 2rem]" />
;<div cs="maxWidth[100vw - 2rem]!" />
;<div cs="md:maxWidth[100vw - 2rem]" />
;<div cs="hover:(maxWidth[100vw - 2rem] width[2rem])" />
;<div cs="hover:(maxWidth[100vw - 2rem] before:content['test'])" />
;<div cs="hover:(maxWidth[100vw - 2rem] before:content['test'])!" />
;<div cs="hover:(maxWidth[100vw - 2rem]! before:content['test'])" />

// within tw prop
;<div tw="maxWidth[100vw - 2rem]" />
;<div tw="maxWidth[100vw - 2rem] block" />
;<div tw="md:maxWidth[100vw - 2rem]" />
;<div tw="hover:(maxWidth[100vw - 2rem] width[2rem])" />
;<div tw="hover:(maxWidth[100vw - 2rem] before:content['test'])" />
;<div tw="hover:(maxWidth[100vw - 2rem] before:content['test'])!" />
;<div tw="hover:(maxWidth[100vw - 2rem]! before:content['test'])" />

// within css prop
;<div css={tw`lg:bg-red-500 max-width[100vw]`} />

// within tw import
tw`maxWidth[100vw - 2rem]`
tw`maxWidth[100vw - 2rem] block`
tw`md:maxWidth[100vw - 2rem]`
tw`hover:(maxWidth[100vw - 2rem] width[2rem])`
tw`hover:(maxWidth[100vw - 2rem] before:content['test'])`
tw`hover:(maxWidth[100vw - 2rem] before:content['test'])!`
tw`hover:(maxWidth[100vw - 2rem]! before:content['test'])`

// prop ordering
;<div css={{ color: 'red' }} cs="margin[50px]" tw="mt-4 content['content']" />

// Setting css variables
tw`--css-prop[true] md:--css-prop[false]`

// Using css variables
tw`max-width[var(--css-react)] md:max-width[var(--css-react-md)]`

// Browser vendor prefixes
tw`-webkit-gradient[gradient here] md:-webkit-gradient[gradient here md]`

// Grid template
tw`grid-template-columns[[main-start] 1fr [content-start] 1fr [content-end] 1fr [main-end]] md:grid-template-columns[[main-start-md] 1fr [content-start-md] 1fr [content-end-md] 1fr [main-end-md]]`

// Short css trumps core plugins
tw`transition-property[margin]`

// Crazy calcs
tw`padding[calc((2em * -1) + var(--myVar))]`

// Multiline
tw`padding[
    calc((2em * -1) + var(--myVar))
]`
tw`padding[
    calc((2em * -1) +
    var(--myVar))
]`

// Theme value
tw`--color[theme(colors.red.500)]`
tw`--color[this theme(colors.red.500) that]`
