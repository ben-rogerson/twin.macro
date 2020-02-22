import tw from './macro'

const styles = tw`uppercase`
const Box = tw.div`text-red-500`
const BoxExtended = tw(Box)`bg-blue-500`

// Media queries

const styles2 = tw`lg:uppercase`
const Box2 = tw.div`lg:text-red-500`
const BoxExtended2 = tw(Box2)`lg:bg-blue-500`

// Important

const styles3 = tw`lg:uppercase!`
const Box3 = tw.div`lg:text-red-500!`
const BoxExtended3 = tw(Box3)`lg:bg-blue-500!`
