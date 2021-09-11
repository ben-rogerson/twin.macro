import tw from './macro'
// tw prop
;<div tw="block" />

// tw + css prop
;<div tw="block" css={{ color: 'black' }} />
;<div tw="block" css={tw`text-black`} />
;<div css={{ color: 'black' }} tw="block" />
;<div css={{ color: 'black' }} tw="block" thisShouldBePreserved="yup" />

// Extracted styles
const styles = {
  container: ({ isInline }) => ({ ...tw`block`, ...(isInline && tw`inline`) }),
}
;<div css={styles.container({ isInline: true })} />

// Dot syntax
const Component = { Sub: () => [] }
;<Component.Sub css={tw`fixed`} />
;<Component.Sub tw="fixed" />
