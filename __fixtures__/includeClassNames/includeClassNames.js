import tw from './macro'

const SkipEmptyClassName = <div className="" />
const OnlyUppercaseConverted = <div className="uppercase spare-class" />
const AllConverted = <div className="uppercase block" />
const SkippedCurlies = <div className={'mt-1'} />
const SkippedConditionals = <div className={true && 'mt-1'} />
const SkippedGroup = <div className="group" />

// css + className
const CssPropFirst = (
  <div
    css={`
      color: red;
    `}
    className="block"
  />
)
const CssPropLast = (
  <div
    className="block"
    css={`
      color: red;
    `}
  />
)

// tw + className
const TwPropFirst = <div tw="block" className="mt-1" />
const TwPropLast = <div className="mt-1" tw="block" />

// tw + css + className
const TwThenCssThenClassName = (
  <div
    tw="block"
    css={`
      color: red;
    `}
    className="mt-1"
  />
)
const TwThenClassNameThenCss_KNOWN_ORDER_ISSUE = (
  <div
    tw="block"
    className="mt-1"
    css={`
      color: red;
    `}
  />
)
const ClassNameThenTwThenCss_KNOWN_ORDER_ISSUE = (
  <div
    className="mt-1"
    tw="block"
    css={`
      color: red;
    `}
  />
)
const ClassNameThenCssThenTw = (
  <div
    className="mt-1"
    css={`
      color: red;
    `}
    tw="block"
  />
)
const CssThenClassNameThenTw_KNOWN_ORDER_ISSUE = (
  <div
    css={`
      color: red;
    `}
    className="mt-1"
    tw="block"
  />
)
const CssThenTwThenClassName = (
  <div
    css={`
      color: red;
    `}
    tw="block"
    className="mt-1"
  />
)

// styled + everything
const Button = tw.div``

const StyledTwThenCssThenClassName = (
  <Button
    tw="block"
    css={`
      color: red;
    `}
    className="mt-1"
  />
)
const StyledTwThenClassNameThenCss_KNOWN_ORDER_ISSUE = (
  <Button
    tw="block"
    className="mt-1"
    css={`
      color: red;
    `}
  />
)
const StyledClassNameThenTwThenCss_KNOWN_ORDER_ISSUE = (
  <Button
    className="mt-1"
    tw="block"
    css={`
      color: red;
    `}
  />
)
const StyledClassNameThenCssThenTw = (
  <Button
    className="mt-1"
    css={`
      color: red;
    `}
    tw="block"
  />
)
const StyledCssThenClassNameThenTw_KNOWN_ORDER_ISSUE = (
  <Button
    css={`
      color: red;
    `}
    className="mt-1"
    tw="block"
  />
)
const StyledCssThenTwThenClassName = (
  <Button
    css={`
      color: red;
    `}
    tw="block"
    className="mt-1"
  />
)
