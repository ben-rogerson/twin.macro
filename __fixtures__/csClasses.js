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
