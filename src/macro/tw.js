import { parseTte, replaceWithLocation } from './../macroHelpers'
import { assert } from './../utils'
import { logGeneralError } from './../logging'
import addDebugProperty from './debug'

const handleTwProperty = ({ getStyles, program, t, state }) =>
  program.traverse({
    JSXAttribute(path) {
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

      addDebugProperty({ t, attributes, rawClasses, path, state })
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

    const rawClasses = parsed.string

    replaceWithLocation(parsed.path, getStyles(rawClasses, t, state))
  })
}

export { handleTwProperty, handleTwFunction }
