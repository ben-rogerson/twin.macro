import tw from './macro'

/**
 * Test comments
 */
;<div css={tw`// comment`} />
;<div css={tw`/* comment */`} />
;<div
  css={tw`// comment  
/*
multline
comment
*/
block
// comment
`}
/>
;<div
  css={tw`/*  block  
comment too
*/`}
/>
;<div
  css={tw`// a comment
block
`}
/>
;<div
  css={tw`/*
// comment */
block
`}
/>
;<div
  css={tw`// hi
// ho /*
hum
*/`}
/>
