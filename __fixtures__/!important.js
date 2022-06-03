import tw from './macro'

const Box = tw.div`text-red-500`

const Important = tw`lg:uppercase!`
const MediaImportant = tw.div`lg:text-red-500!`
const ElementMediaImportant = tw(Box)`lg:bg-blue-500!`

const PlaceholderImportant = tw.input`placeholder-red-500!`
const StateImportant = tw.input`hover:text-red-500!`
const StatePlaceholderImportant = tw.input`hover:placeholder-red-500!`
const StateStatePlaceholderImportant = tw.input`active:hover:placeholder-red-500!`
const StateMultiplePropertiesImportant = tw.input`hover:truncate!`
const MediaStateMultiplePropertiesImportant = tw.input`lg:hover:truncate!`
const ElementMediaStateMultiplePropertiesImportant = tw(Box)`lg:hover:truncate!`

const JsxPlaceholderImportant = () => <input tw="placeholder-green-500!" />

const ImportantPrefixPrefix = tw`lg:!uppercase`
const MediaImportantPrefix = tw.div`lg:!text-red-500`
const ElementMediaImportantPrefix = tw(Box)`lg:!bg-blue-500`

const PlaceholderImportantPrefix = tw.input`!placeholder-red-500`
const StateImportantPrefix = tw.input`hover:!text-red-500`
const StatePlaceholderImportantPrefix = tw.input`hover:!placeholder-red-500`
const StateStatePlaceholderImportantPrefix = tw.input`active:hover:!placeholder-red-500`
const StateMultiplePropertiesImportantPrefix = tw.input`hover:!truncate`
const MediaStateMultiplePropertiesImportantPrefix = tw.input`lg:hover:!truncate`
const ElementMediaStateMultiplePropertiesImportantPrefix = tw(
  Box
)`lg:hover:!truncate`
const VariantImportantPrefixMergeCheck = tw.div`md:!from-black to-[#dc4fc2] bg-gradient-to-r`
const MultiVariantImportantPrefixMergeCheck = tw.div`first:md:!from-black to-[#dc4fc2] bg-gradient-to-r`

const JsxPlaceholderImportantPrefix = () => (
  <input tw="!placeholder-green-500" />
)
