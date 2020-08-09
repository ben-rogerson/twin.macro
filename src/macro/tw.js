import { parseTte, replaceWithLocation } from './../macroHelpers'
import { assert } from './../utils'
import { logGeneralError } from './../logging'
/* eslint-disable-next-line unicorn/prevent-abbreviations */
import { addDebugPropToPath, addDebugPropToExistingPath } from './debug'
import getStyles from './../getStyles'

const handleTwProperty = ({ path, t, state }) => {
  if (path.node.name.name === 'css') state.hasCssProp = true
  // TODO: Add tw-prop for css attributes

  if (path.node.name.name !== 'tw') return
  state.hasTwProp = true

  const nodeValue = path.node.value

  // Allow tw={"class"}
  const expressionValue =
    nodeValue.expression &&
    nodeValue.expression.type === 'StringLiteral' &&
    nodeValue.expression.value

  // Feedback for unsupported usage
  assert(nodeValue.expression && !expressionValue, () =>
    logGeneralError(
      `Only plain strings can be used with the "tw" prop.\nEg: <div tw="text-black" /> or <div tw={"text-black"} />`
    )
  )

  const rawClasses = expressionValue || nodeValue.value || ''
  const styles = getStyles(rawClasses, t, state)

  const jsxPath = path.findParent(p => p.isJSXOpeningElement())
  const attributes = jsxPath.get('attributes')
  const cssAttributes = attributes.filter(
    p => p.node.name && p.node.name.name === 'css'
  )

  if (cssAttributes.length > 0) {
    path.remove()
    const expr = cssAttributes[0].get('value').get('expression')
    if (expr.isArrayExpression()) {
      // TODO: unshiftContainer could also be supported here so we can
      // preserve the original position of the css prop.
      // But it would break the specificity of existing css+tw combinations.
      expr.pushContainer('elements', styles)
    } else {
      assert(!expr.node, () =>
        logGeneralError(
          `An empty css prop (css="") isn’t supported alongside the tw prop (tw="...")`
        )
      )
      expr.replaceWith(t.arrayExpression([expr.node, styles]))
    }

    addDebugPropToExistingPath({
      t,
      attributes,
      rawClasses,
      path: jsxPath,
      state,
    })
  } else {
    path.replaceWith(
      t.jsxAttribute(t.jsxIdentifier('css'), t.jsxExpressionContainer(styles))
    )
    addDebugPropToPath({ t, attributes, rawClasses, path, state })
  }
}

const handleTwFunction = ({ references, state, t }) => {
  const defaultImportReferences = references.default || references.tw || []
  defaultImportReferences.forEach(path => {
    const parent = path.findParent(x => x.isTaggedTemplateExpression())
    if (!parent) return

    const parsed = parseTte({
      path: parent,
      types: t,
      styledIdentifier: state.styledIdentifier,
      state,
    })
    if (!parsed) return

    const rawClasses = parsed.string

    replaceWithLocation(parsed.path, getStyles(rawClasses, t, state))
  })
}

export { handleTwProperty, handleTwFunction }
