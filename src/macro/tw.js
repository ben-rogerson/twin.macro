import {
  getParentJSX,
  parseTte,
  replaceWithLocation,
  getAttributeNames,
  getCssAttributeData,
  makeStyledComponent,
} from './../macroHelpers'
import { throwIf } from './../utils'
import { logGeneralError, logStylePropertyError } from './../logging'
import { addDataTwPropToPath, addDataPropToExistingPath } from './debug'
import getStyleData from './../getStyleData'

const moveTwPropToStyled = props => {
  const { jsxPath, astStyles } = props

  makeStyledComponent({ ...props, secondArg: astStyles })

  // Remove the tw attribute
  const tagAttributes = jsxPath.node.attributes
  const twAttributeIndex = tagAttributes.findIndex(
    n => n.name && n.name.name === 'tw'
  )
  if (twAttributeIndex < 0) return
  jsxPath.node.attributes.splice(twAttributeIndex, 1)
}

const mergeIntoCssAttribute = ({ path, astStyles, cssAttribute, t }) => {
  if (!cssAttribute) return

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

  const attributeNames = getAttributeNames(path)

  const isBeforeCssAttribute =
    attributeNames.indexOf('tw') - attributeNames.indexOf('css') < 0

  if (existingCssAttribute.isArrayExpression()) {
    //  The existing css prop is an array, eg: css={[...]}
    isBeforeCssAttribute
      ? existingCssAttribute.unshiftContainer('elements', astStyles)
      : existingCssAttribute.pushContainer('elements', astStyles)
  } else {
    // css prop is either:
    // TemplateLiteral
    // <div css={`...`} tw="..." />
    // or an ObjectExpression
    // <div css={{ ... }} tw="..." />
    // or ArrowFunctionExpression/FunctionExpression
    // <div css={() => (...)} tw="..." />

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
}

const handleTwProperty = ({ path, t, program, state }) => {
  if (!path.node || path.node.name.name !== 'tw') return
  state.hasTwAttribute = true

  const nodeValue = path.node.value

  // Allow tw={"class"}
  const expressionValue =
    nodeValue.expression &&
    nodeValue.expression.type === 'StringLiteral' &&
    nodeValue.expression.value

  // Feedback for unsupported usage
  throwIf(nodeValue.expression && !expressionValue, () =>
    logGeneralError(
      `Only plain strings can be used with the "tw" prop.\nEg: <div tw="text-black" /> or <div tw={"text-black"} />\nRead more at https://twinredirect.page.link/template-literals`
    )
  )

  const rawClasses = expressionValue || nodeValue.value || ''
  const { astStyles } = getStyleData(rawClasses, { t, state })

  const jsxPath = getParentJSX(path)
  const attributes = jsxPath.get('attributes')
  const { attribute: cssAttribute } = getCssAttributeData(attributes)

  if (state.configTwin.moveTwPropToStyled) {
    moveTwPropToStyled({ astStyles, jsxPath, t, program, state })
    addDataTwPropToPath({ t, attributes, rawClasses, path, state })
    return
  }

  if (!cssAttribute) {
    // Replace the tw prop with the css prop
    path.replaceWith(
      t.jsxAttribute(
        t.jsxIdentifier('css'),
        t.jsxExpressionContainer(astStyles)
      )
    )
    addDataTwPropToPath({ t, attributes, rawClasses, path, state })
    return
  }

  // Merge tw styles into an existing css prop
  mergeIntoCssAttribute({ cssAttribute, path: jsxPath, astStyles, t })

  path.remove() // remove the tw prop

  addDataPropToExistingPath({ t, attributes, rawClasses, path: jsxPath, state })
}

const handleTwFunction = ({ references, state, t }) => {
  const defaultImportReferences = references.default || references.tw || []

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  defaultImportReferences.forEach(path => {
    /**
     * Gotcha: After twin changes a className/tw/cs prop path then the reference
     * becomes stale and needs to be refreshed with crawl()
     */
    const { parentPath } = path
    if (!parentPath.isTaggedTemplateExpression()) path.scope.crawl()

    const parent = path.findParent(x => x.isTaggedTemplateExpression())
    if (!parent) return

    // Check if the style attribute is being used
    if (!state.configTwin.allowStyleProp) {
      const jsxAttribute = parent.findParent(x => x.isJSXAttribute())
      const attributeName =
        jsxAttribute && jsxAttribute.get('name').get('name').node
      throwIf(attributeName === 'style', () => logStylePropertyError)
    }

    const parsed = parseTte({
      path: parent,
      types: t,
      styledIdentifier: state.styledIdentifier,
      state,
    })
    if (!parsed) return

    const rawClasses = parsed.string
    // Add tw-prop for css attributes
    const jsxPath = path.findParent(p => p.isJSXOpeningElement())

    if (jsxPath) {
      const attributes = jsxPath.get('attributes')
      const pathData = { t, attributes, rawClasses, path: jsxPath, state }
      addDataPropToExistingPath(pathData)
    }

    const { astStyles } = getStyleData(rawClasses, { t, state })
    replaceWithLocation(parsed.path, astStyles)
  })
}

export { handleTwProperty, handleTwFunction }
