import tw from './macro'

const styles = tw`uppercase`
const Box = tw.div`text-red-500`
const BoxExtended = tw(Box)`bg-blue-500`

// Media queries

const MediaProperty = tw`lg:uppercase`
const MediaColorProperty = tw.div`lg:text-red-500`
const ElementMediaColorProperty = tw(Box2)`lg:bg-blue-500`
const MediaPropertyDuplicates = tw`lg:bg-blue-500 lg:bg-black`

// Important

const Important = tw`lg:uppercase!`
const MediaImportant = tw.div`lg:text-red-500!`
const ElementMediaImportant = tw(Box3)`lg:bg-blue-500!`

const PlaceholderImportant = tw.input`placeholder-text-red-500!`
const StateImportant = tw.input`hover:text-red-500!`
const StatePlaceholderImportant = tw.input`hover:placeholder-text-red-500!`
const StateStatePlaceholderImportant = tw.input`active:hover:placeholder-text-red-500!`
const StateMultiplePropertiesImportant = tw.input`hover:truncate!`
const MediaStateMultiplePropertiesImportant = tw.input`lg:hover:truncate!`
const ElementMediaStateMultiplePropertiesImportant = tw(
  Box3
)`lg:hover:truncate!`

const JsxPlaceholder = () => <input tw="placeholder-text-red-500" />
const JsxPlaceholderImportant = () => <input tw="placeholder-text-red-500!" />
