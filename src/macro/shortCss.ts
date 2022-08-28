/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line import/no-relative-parent-imports
import { getStyles } from '../core'
import isEmpty from './lib/util/isEmpty'
import { addDataTwPropToPath, addDataPropToExistingPath } from './dataProp'
import {
  astify,
  getParentJSX,
  getAttributeNames,
  getCssAttributeData,
} from './lib/astHelpers'
import type { NodePath, T, JSXAttributeHandler } from './types'

function handleCsProperty({
  path,
  t,
  state,
  coreContext,
}: JSXAttributeHandler): void {
  if (coreContext.twinConfig.disableCsProp) return
  if (!path.node || path.node.name.name !== 'cs') return

  const nodeValue = path.node.value
  const nodeExpression = (nodeValue as T.JSXExpressionContainer).expression

  // Allow cs={"property[value]"}
  const expressionValue =
    nodeExpression &&
    nodeExpression.type === 'StringLiteral' &&
    nodeExpression.value

  if (nodeExpression)
    coreContext.assert(
      Boolean(expressionValue),
      ({ color }) =>
        `${color(
          `✕ Only plain strings can be used with the "cs" prop`
        )}\n\nTry using it like this: ${color(
          '<div cs="maxWidth[30rem]" />',
          'success'
        )}\n\nRead more at https://twinredirect.page.link/cs-classes`
    )

  const rawClasses =
    expressionValue || (nodeValue as T.StringLiteral).value || ''
  const { styles } = getStyles(rawClasses, {
    isShortCssOnly: true,
    ...coreContext,
  })
  const astStyles = astify(isEmpty(styles) ? {} : styles, t)

  const jsxPath = getParentJSX(path)
  const attributes = jsxPath.get('attributes')
  const { attribute: cssAttribute } = getCssAttributeData(attributes)

  if (!cssAttribute) {
    // Replace the tw prop with the css prop
    path.replaceWith(
      t.jsxAttribute(
        t.jsxIdentifier('css'),
        t.jsxExpressionContainer(astStyles)
      )
    )
    addDataTwPropToPath({
      t,
      attributes,
      rawClasses,
      path,
      state,
      coreContext,
      propName: 'data-cs',
    })
    return
  }

  // The expression is the value as a NodePath
  const attributeValuePath = cssAttribute.get('value')

  // If it's not {} or "", get out of here
  if (
    !attributeValuePath ||
    // @ts-expect-error The type checking functions don't exist on NodePath
    (!attributeValuePath.isJSXExpressionContainer() &&
      // @ts-expect-error The type checking functions don't exist on NodePath
      !attributeValuePath.isStringLiteral())
  )
    return

  // @ts-expect-error The type checking functions don't exist on NodePath
  const existingCssAttribute = attributeValuePath.isStringLiteral()
    ? (attributeValuePath as unknown as NodePath<T.StringLiteral>)
    : // @ts-expect-error get doesn’t exist on the types
      (attributeValuePath.get(
        'expression'
      ) as NodePath<T.JSXExpressionContainer>)

  const attributeNames = getAttributeNames(jsxPath)
  const isBeforeCssAttribute =
    attributeNames.indexOf('cs') - attributeNames.indexOf('css') < 0

  if (existingCssAttribute.isArrayExpression()) {
    // The existing css prop is an array, eg: css={[...]}
    if (isBeforeCssAttribute) {
      // @ts-expect-error unshiftContainer doesn't exist on NodePath
      existingCssAttribute.unshiftContainer('elements', astStyles)
    } else {
      // @ts-expect-error pushContainer doesn't exist on NodePath
      existingCssAttribute.pushContainer('elements', astStyles)
    }
  } else {
    // css prop is either:
    // TemplateLiteral
    // <div css={`...`} cs="..." />
    // or an ObjectExpression
    // <div css={{ ... }} cs="..." />
    // or ArrowFunctionExpression/FunctionExpression
    // <div css={() => (...)} cs="..." />
    const existingCssAttributeNode = existingCssAttribute.node

    // The existing css prop is an array, eg: css={[...]}
    const styleArray = isBeforeCssAttribute
      ? [astStyles, existingCssAttributeNode]
      : [existingCssAttributeNode, astStyles]

    const arrayExpression = t.arrayExpression(styleArray as T.Expression[])

    const { parent } = existingCssAttribute
    const replacement =
      parent.type === 'JSXAttribute'
        ? t.jsxExpressionContainer(arrayExpression)
        : arrayExpression

    existingCssAttribute.replaceWith(replacement)
  }

  path.remove() // remove the cs prop

  addDataPropToExistingPath({
    t,
    attributes,
    rawClasses,
    path: jsxPath,
    state,
    coreContext,
    propName: 'data-cs',
  })
}

export { handleCsProperty }
