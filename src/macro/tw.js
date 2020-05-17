const handleTwProperty = ({ getStyles, program, t, state }) =>
  program.traverse({
    JSXAttribute(path) {
      if (path.node.name.name !== 'tw') return
      const styles = getStyles(path.node.value.value, t, state)

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

export { handleTwProperty }
