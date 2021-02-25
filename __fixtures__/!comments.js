import tw from './macro'

/**
 * Test comments
 */

tw`// comment`

tw`/* comment */`

tw`// comment  
/*
multline
comment
*/
block
// comment
`

tw`/*  block  
comment too
*/`

tw`// a comment
block
`

tw`/*
// comment */
block
`

tw`// hi
// ho /*
hum
*/`
