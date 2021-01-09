import { throwIf } from './../utils'
import { logGeneralError } from './../logging'
/* eslint-disable-next-line unicorn/prevent-abbreviations */
import { addDataTwPropToPath, addDataTwPropToExistingPath } from './debug'
import getStyles from './../getStyles'

const handleClassNameProperty = ({ path, t, state }) => {
  if (!state.configTwin.includeClassNames) return
  if (path.node.name.name !== 'className') return

  const nodeValue = path.node.value

  // Ignore className if it cannot be resolved
  if (nodeValue.expression) return

  const rawClasses = nodeValue.value || ''
  if (!rawClasses) return

  const { styles, mismatched, matched } = getStyles(rawClasses, t, state, true)

  // When classes can't be matched we add them back into the className (it exists as a few properties)
  path.node.value.value = mismatched
  path.node.value.extra.rawValue = mismatched
  path.node.value.extra.raw = `"${mismatched}"`

  const jsxPath = path.findParent(p => p.isJSXOpeningElement())
  const attributes = jsxPath.get('attributes')
  const cssAttributes = attributes.filter(
    p => p.node.name && p.node.name.name === 'css'
  )

  if (cssAttributes.length === 0) {
    const attribute = t.jsxAttribute(
      t.jsxIdentifier('css'),
      t.jsxExpressionContainer(styles)
    )
    mismatched ? path.insertAfter(attribute) : path.replaceWith(attribute)
    addDataTwPropToPath({ t, attributes, rawClasses: matched, path, state })

    return
  }

  const expr = cssAttributes[0].get('value').get('expression')

  if (expr.isArrayExpression()) {
    expr.unshiftContainer('elements', styles)
  } else {
    const cssProperty = expr.node
    throwIf(!cssProperty, () =>
      logGeneralError(
        `An empty css prop (css="") isn’t supported alongside the className prop`
      )
    )
    expr.replaceWith(t.arrayExpression([styles, cssProperty]))
  }

  if (!mismatched) path.remove()

  addDataTwPropToExistingPath({
    t,
    attributes,
    rawClasses: matched,
    path: jsxPath,
    state,
  })
}

export { handleClassNameProperty }
