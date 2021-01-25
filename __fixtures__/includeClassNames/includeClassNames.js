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
const TwThenClassNameThenCss = (
  <div
    tw="block"
    className="mt-1"
    css={`
      color: red;
    `}
  />
)
const ClassNameThenTwThenCss = (
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
const CssThenClassNameThenTw = (
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
const StyledTwThenClassNameThenCss = (
  <Button
    tw="block"
    className="mt-1"
    css={`
      color: red;
    `}
  />
)
const StyledClassNameThenTwThenCss = (
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
const StyledCssThenClassNameThenTw = (
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
// All four css props
const TwThenClassNameThenCsThenCss = (
  <Button
    tw="block"
    className="ml-1"
    cs="content['cs']"
    css={`
      content: 'css';
    `}
  />
)
const TwThenClassNameThenCssThenCs = (
  <Button
    tw="block"
    className="ml-1"
    css={`
      content: 'css';
    `}
    cs="content['cs']"
  />
)
const TwThenCssThenClassNameThenCs = (
  <Button
    tw="block"
    css={`
      content: 'css';
    `}
    className="ml-1"
    cs="content['cs']"
  />
)
const CssThenTwThenClassNameThenCs = (
  <Button
    css={`
      content: 'css';
    `}
    tw="block"
    className="ml-1"
    cs="content['cs']"
  />
)
