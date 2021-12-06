import tw from './macro' // twinImport

// Css prop isn't handled by twin
tw.div`block`
;<div tw="block" />

const Test = tw.div``
;<Test tw="block" />
