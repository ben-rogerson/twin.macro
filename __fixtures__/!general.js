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

// Only basic evaluations supported
// No functions or "beyond basic" conditionals.
const plainConditional = true && 'red'
const plainVariable = `bg-${plainConditional}-500`
tw`${plainVariable}`
