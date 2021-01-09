import { parseTte, replaceWithLocation } from './../macroHelpers'
import { throwIf } from './../utils'
import { logGeneralError, logStylePropertyError } from './../logging'
/* eslint-disable-next-line unicorn/prevent-abbreviations */
import { addDataTwPropToPath, addDataTwPropToExistingPath } from './debug'
import getStyles from './../getStyles'

const handleTwProperty = ({ path, t, state }) => {
  if (!path.node || path.node.name.name !== 'tw') return
  state.hasTwProp = true

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

  const { styles } = getStyles(rawClasses, t, state)

  const jsxPath = path.findParent(p => p.isJSXOpeningElement())
  const attributes = jsxPath.get('attributes')
  const cssAttributes = attributes.filter(
    p => p.node.name && p.node.name.name === 'css'
  )

  if (cssAttributes.length === 0) {
    // Replace the tw prop with the css prop
    path.replaceWith(
      t.jsxAttribute(t.jsxIdentifier('css'), t.jsxExpressionContainer(styles))
    )
    addDataTwPropToPath({ t, attributes, rawClasses, path, state })
    return
  }

  const attributeList = attributes.map(p => p.node.name && p.node.name.name)

  path.remove() // remove the tw prop

  const expr = cssAttributes[0].get('value').get('expression')

  const hasCssFirst = attributeList.indexOf('tw') > attributeList.indexOf('css')

  if (expr.isArrayExpression()) {
    // css prop is an array
    // <div css={[ ... ]} tw="..." />
    if (hasCssFirst) {
      expr.pushContainer('elements', styles)
    } else {
      expr.unshiftContainer('elements', styles)
    }
  } else {
    // css prop is either:
    // TemplateLiteral
    // <div css={`...`} tw="..." />
    // or an ObjectExpression
    // <div css={{ ... }} tw="..." />
    // or ArrowFunctionExpression/FunctionExpression
    // <div css={() => (...)} tw="..." />

    const cssProperty = expr.node

    throwIf(!cssProperty, () =>
      logGeneralError(
        `An empty css prop (css="") isn’t supported alongside the tw prop (tw="...")`
      )
    )

    expr.replaceWith(
      t.arrayExpression(
        hasCssFirst ? [cssProperty, styles] : [styles, cssProperty]
      )
    )
  }

  addDataTwPropToExistingPath({
    t,
    attributes,
    rawClasses,
    path: jsxPath,
    state,
  })
}

const handleTwFunction = ({ references, state, t }) => {
  const defaultImportReferences = references.default || references.tw || []
  defaultImportReferences.forEach(path => {
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
      addDataTwPropToExistingPath({
        t,
        attributes,
        rawClasses,
        path: jsxPath,
        state,
      })
    }

    const { styles } = getStyles(rawClasses, t, state)
    replaceWithLocation(parsed.path, styles)
  })
}

export { handleTwProperty, handleTwFunction }
