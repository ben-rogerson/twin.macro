import tw from './macro'

// tw prop prefix
;<div tw="tw-text-black" />

// tw import prefix
;<div css={tw`tw-bg-red-500`} />

// tw prop + import prefix
;<div tw="tw-text-black" css={tw`lg:tw-bg-red-500`} />

// tw import + short css
;<div css={tw`lg:tw-bg-red-500 max-width[100vw]`} />

// tw import + arbitrary property
;<div css={tw`lg:tw-bg-red-500 [max-width:100vw]`} />

// className should be ignored without the prefix
;<div className="block" />

// className should be converted with a prefix
;<div className="tw-block" />

// group
;<div tw="hover:(lg:tw-bg-red-500)" />
;<div tw="hover:(lg:tw-bg-red-500 max-width[100vw])" />
;<div tw="hover:(lg:tw-bg-red-500 [max-width:100vw])" />
;<div css={tw`hover:(lg:tw-bg-red-500)`} />
;<div css={tw`hover:(lg:tw-bg-red-500 max-width[100vw])`} />
;<div css={tw`hover:(lg:tw-bg-red-500 [max-width:100vw])`} />

// custom plugin classes
;<div tw="tw-plugin-class" />
;<div tw="tw-test-1" />
;<div tw="tw-test-2" />
