import { parseTte, replaceWithLocation } from './../macroHelpers'
import { throwIf } from './../utils'
import { logGeneralError, logStylePropertyError } from './../logging'
/* eslint-disable-next-line unicorn/prevent-abbreviations */
import { addDataTwPropToPath, addDataTwPropToExistingPath } from './debug'
import getStyles from './../getStyles'

const handleTwProperty = ({ path, t, state }) => {
  if (path.node.name.name === 'css') state.hasCssProp = true

  if (path.node.name.name !== 'tw') return
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
  const styles = getStyles(rawClasses, t, state)

  const jsxPath = path.findParent(p => p.isJSXOpeningElement())
  const attributes = jsxPath.get('attributes')
  const attributeList = attributes.map(p => p.node.name && p.node.name.name)
  const cssAttributes = attributes.filter(
    p => p.node.name && p.node.name.name === 'css'
  )

  if (cssAttributes.length > 0) {
    path.remove()
    const expr = cssAttributes[0].get('value').get('expression')
    if (expr.isArrayExpression()) {
      // Maintain the ordering of jsx props
      // <div css={[tw`mt-3`]} tw="block" />
      const shouldPush =
        attributeList.indexOf('tw') > attributeList.indexOf('css')
      if (shouldPush) {
        expr.pushContainer('elements', styles)
      } else {
        expr.unshiftContainer('elements', styles)
      }
    } else {
      throwIf(!expr.node, () =>
        logGeneralError(
          `An empty css prop (css="") isn’t supported alongside the tw prop (tw="...")`
        )
      )
      expr.replaceWith(t.arrayExpression([expr.node, styles]))
    }

    addDataTwPropToExistingPath({
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
    addDataTwPropToPath({ t, attributes, rawClasses, path, state })
  }
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

    replaceWithLocation(parsed.path, getStyles(rawClasses, t, state))
  })
}

export { handleTwProperty, handleTwFunction }
