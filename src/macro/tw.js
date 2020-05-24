import { parseTte, replaceWithLocation } from './../macroHelpers'
import { assert } from './../utils'
import { logGeneralError } from './../logging'

const handleTwProperty = ({ getStyles, program, t, state }) =>
  program.traverse({
    JSXAttribute(path) {
      if (path.node.name.name !== 'tw') return
      if (!state.hasTwProp) {
        state.hasTwProp = true
      }

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

      const styles = getStyles(
        expressionValue || nodeValue.value || '',
        t,
        state
      )

      const attributes = path
        .findParent(p => p.isJSXOpeningElement())
        .get('attributes')
      const cssAttributes = attributes.filter(
        p => p.node.name && p.node.name.name === 'css'
      )

      if (cssAttributes.length > 0) {
        path.remove()
        const expr = cssAttributes[0].get('value').get('expression')
        if (expr.isArrayExpression()) {
          expr.pushContainer('elements', styles)
        } else {
          expr.replaceWith(t.arrayExpression([expr.node, styles]))
        }
      } else {
        path.replaceWith(
          t.jsxAttribute(
            t.jsxIdentifier('css'),
            t.jsxExpressionContainer(styles)
          )
        )
      }
    },
  })

const handleTwFunction = ({ getStyles, references, state, t }) => {
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

    replaceWithLocation(parsed.path, getStyles(parsed.string, t, state))
  })
}

export { handleTwProperty, handleTwFunction }
