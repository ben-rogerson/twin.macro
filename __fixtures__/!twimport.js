/* eslint-disable @typescript-eslint/no-unused-vars */
import tw from './macro'

/**
 * Basic
 */

const Basic = tw`hover:bg-black`
const BasicInterpolation = tw`${'hover:bg-black'}`

/**
 * Styled
 */

const Styled = tw.div`hover:bg-black`
const StyledInterpolation = tw.div`${'hover:bg-black'}`

// TODO: Get working
// const styledTw = tw.div`${tw`hover:black`}`

/**
 * Call expressions
 */

// TODO: Get working
// const CallBasicString = c

// TODO: Get working
// const CallBasicLiteral = tw(`block`)

// TODO: Get working
// const CallIdentifier = tw(Basic)

// TODO: Get working
// const CallIdentifierStyled = tw(Basic)`hover:bg-black`

// TODO: Get working
// const CallArrayIdentifier = tw([Basic])

const CallArrayLogicalIdentifier = tw([true && Basic])

const CallArrayTurnaryIdentifier = ({ isSpaced }) =>
  tw([isSpaced ? 'mt-6' : Basic])

const CallLogical = tw(({ isSpaced }) => isSpaced && [`mt-6`])

const CallLogicalNestedLogical = tw(
  ({ isSpaced }) => isSpaced && [`mt-6`, false && 'hover:bg-black']
)

const CallLogicalNestedTurnary = tw(
  ({ isSpaced }) => isSpaced && [isSpaced ? 'mt-6' : 'mt-3']
)

// TODO: Get working
// const CallClone = tw(Basic)`hover:bg-black`

// TODO: Get working
// const CallTemplateLogicalLiteral = tw(
//   `${({ isSpaced }) => isSpaced && 'hover:bg-black'}`
// )

// TODO: Get working
// const CallTemplateLogicalTurnary = tw(
//   `${({ isSpaced }) => (isSpaced ? 'hover:bg-black' : 'mt-6')}`
// )

/**
 * Array
 */

// TODO: Get working
// const ArrayIdentifier = tw[Basic]

const Array = tw['hover:bg-black']

const ArrayLogicalNestedLogical = ({ isSpaced }) =>
  isSpaced && tw[('mt-6', true && 'hover:bg-black')]

const ArrayLogicalNestedTurnary = ({ isSpaced }) =>
  isSpaced && tw[('mt-6', isSpaced ? 'hover:bg-black' : 'mt-6')]
