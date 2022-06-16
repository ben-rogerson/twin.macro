import tw from './macro'

/**
 * Test comments
 */

// singleline
;<div css={tw`// comment`} />

// multiline
;<div css={tw`/* comment */`} />

// mixture
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

// multiline comment
;<div
  css={tw`/*  block  
comment too
*/`}
/>

// singleline comment with class
;<div
  css={tw`// a comment
block
`}
/>

// multiline comment out a singleline comment with class
;<div
  css={tw`/*
// comment */
block
`}
/>

// mixture with single and multiline on same line
;<div
  css={tw`// hi
// ho /*
hum
*/`}
/>

// comment in variant group and consecutive strings
;<div css={tw`md:(text-xl/* text-yellow-500 */font-black)`} />

// break right bracket
;<div
  css={tw`2xl:(// ####@@@@ 
  [background:/*start*/rgb(191, 201/*inner*/, 211)])`}
/>

// comments within multiline comment
;<div
  css={tw`relative
  lg:(
    /***
    helloworld
    /****/
    //***
    flex
    text-5xl
    border-yellow-500
    /****/
)!`}
/>
