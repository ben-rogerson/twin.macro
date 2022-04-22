/**
 * cs = Short css
 */

import {
  getParentJSX,
  getAttributeNames,
  getCssAttributeData,
} from './../macroHelpers'
import { throwIf } from './../utils'
import { logGeneralError } from './../logging'
import { addDataTwPropToPath, addDataPropToExistingPath } from './debug'
import getStyleData from './../getStyleData'

const handleCsProperty = ({ path, t, state }) => {
  if (state.configTwin.disableCsProp) return
  if (!path.node || path.node.name.name !== 'cs') return
  state.hasCsProp = true
  const isCsOnly = true

  const nodeValue = path.node.value

  // Allow cs={"property[value]"}
  const expressionValue =
    nodeValue.expression &&
    nodeValue.expression.type === 'StringLiteral' &&
    nodeValue.expression.value

  // Feedback for unsupported usage
  throwIf(nodeValue.expression && !expressionValue, () =>
    logGeneralError(
      `Only plain strings can be used with the "cs" prop.\nEg: <div cs="maxWidth[30rem]" />\nRead more at https://twinredirect.page.link/cs-classes`
    )
  )

  const rawClasses = expressionValue || nodeValue.value || ''
  const { astStyles } = getStyleData(rawClasses, { isCsOnly, t, state })

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
    // TODO: Update the naming of this function
    addDataTwPropToPath({
      t,
      attributes,
      rawClasses,
      path,
      state,
      propName: 'data-cs',
    })
    return
  }

  // The expression is the value as a NodePath
  const attributeValuePath = cssAttribute.get('value')

  // If it's not {} or "", get out of here
  if (
    !attributeValuePath.isJSXExpressionContainer() &&
    !attributeValuePath.isStringLiteral()
  )
    return

  const existingCssAttribute = attributeValuePath.isStringLiteral()
    ? attributeValuePath
    : attributeValuePath.get('expression')

  const attributeNames = getAttributeNames(jsxPath)
  const isBeforeCssAttribute =
    attributeNames.indexOf('cs') - attributeNames.indexOf('css') < 0

  if (existingCssAttribute.isArrayExpression()) {
    //  The existing css prop is an array, eg: css={[...]}
    isBeforeCssAttribute
      ? existingCssAttribute.unshiftContainer('elements', astStyles)
      : existingCssAttribute.pushContainer('elements', astStyles)
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

    const arrayExpression = t.arrayExpression(styleArray)

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
    propName: 'data-cs',
  })
}

export { handleCsProperty }
