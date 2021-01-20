import tw from './macro'

/**
 * Misc usage tests
 */

const styles = tw`uppercase`
const Box = tw.div`text-red-500`
const BoxExtended = tw(Box)`bg-blue-500`

// Media queries

const MediaProperty = tw`lg:uppercase`
const MediaColorProperty = tw.div`lg:text-red-500`
const ElementMediaColorProperty = tw(Box)`lg:bg-blue-500`
const MediaPropertyDuplicates = tw`lg:bg-blue-500 lg:bg-black`

// Important

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

const JsxPlaceholder = () => <input tw="placeholder-red-500" />
const JsxPlaceholderImportant = () => <input tw="placeholder-green-500!" />

// Only basic evaluations supported
// No functions or "beyond basic" conditionals.
const plainConditional = true && 'red'
const plainVariable = `bg-${plainConditional}-500`
tw`${plainVariable}`
