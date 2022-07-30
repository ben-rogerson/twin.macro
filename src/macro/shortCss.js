// eslint-disable-next-line import/no-relative-parent-imports
import { getStyles } from '../core'
import throwIf from './lib/util/throwIf'
import isEmpty from './lib/util/isEmpty'
import { logGeneralError } from './lib/logging'
import { addDataTwPropToPath, addDataPropToExistingPath } from './dataProp'
import {
  astify,
  getParentJSX,
  getAttributeNames,
  getCssAttributeData,
} from './lib/astHelpers'

function handleCsProperty({ path, t, state, coreContext }) {
  if (coreContext.twinConfig.disableCsProp) return
  if (!path.node || path.node.name.name !== 'cs') return

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
    if (isBeforeCssAttribute) {
      existingCssAttribute.unshiftContainer('elements', astStyles)
    } else {
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
    coreContext,
    propName: 'data-cs',
  })
}

export { handleCsProperty }
