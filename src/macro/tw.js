import { parseTte, replaceWithLocation, astify } from './../macroHelpers'
import { assert, isEmpty } from './../utils'
import { logErrorGood, logGeneralError } from './../logging'
/* eslint-disable-next-line unicorn/prevent-abbreviations */
import { addDebugPropToPath, addDebugPropToExistingPath } from './debug'
import getStyles from './../getStyles'
import { updateCssReferences } from './../macro/css'

const setValueByNodeType = type =>
  ({
    StringLiteral: (node, state) => {
      node.value = getStyles(node.value, state)
    },
    TemplateLiteral: (node, state) => {
      const styles = getStyles(node.quasis[0].value.raw, state)
      // Convert node to a stringLiteral
      node.value = styles
      node.type = 'StringLiteral'
      // Clean up data from old node type
      delete node.quasis
      delete node.expressions
    },
    LogicalExpression: (node, state, t) =>
      setValueByNodeType(node.right.type)(node.right, state, t),
    ConditionalExpression: (node, state, t) => [
      setValueByNodeType(node.consequent.type)(node.consequent, state, t),
      setValueByNodeType(node.alternate.type)(node.alternate, state, t),
    ],
    NullLiteral: () => null,
  }[type] || (() => ({})))

const convertTwArrayElements = (elements, state, t) => {
  if (elements.length === 0) return

  elements.map(node => setValueByNodeType(node.type)(node, state, t))
}

const handleTwProperty = ({ program, state, t }) =>
  program.traverse({
    JSXAttribute(path) {
      if (path.node.name.name === 'css') state.hasCssProp = true
      // TODO: Add tw-prop for css attributes

      if (path.node.name.name !== 'tw') return
      state.hasTwProp = true

      const nodeValue = path.node.value
      const nodeExpression = nodeValue.expression

      // Handle variables used within the tw prop
      if (
        nodeExpression &&
        ['Identifier', 'CallExpression'].includes(nodeExpression.type)
      ) {
        path.node.name.name = 'css'
        return
      }

      // Handle arrays used within the tw prop
      if (nodeExpression && nodeExpression.type === 'ArrayExpression') {
        convertTwArrayElements(nodeExpression.elements, state, t)
        path.node.name.name = 'css'
        return
      }

      const expressionValue =
        nodeExpression &&
        nodeExpression.type === 'StringLiteral' &&
        nodeExpression.value

      // Feedback for unsupported usage
      assert(nodeExpression && !expressionValue, () =>
        logErrorGood(
          `Only functions, arrays and strings can be used with the tw prop.`,
          `<div tw={[boxStyles(isDark)]} /> / <div tw={[isDark && "text-black"]} /> / <div tw={"text-black"} /> / <div tw="text-black" />`
        )
      )

      const rawClasses = expressionValue || nodeValue.value || ''
      const styles = astify(getStyles(rawClasses, state), t)

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
          t.jsxAttribute(
            t.jsxIdentifier('css'),
            t.jsxExpressionContainer(styles)
          )
        )
        addDebugPropToPath({
          t,
          attributes,
          rawClasses,
          path,
          state,
        })
      }
    },
  })

const handleTwFunction = ({ references, state, t }) => {
  const defaultImportReferences = references.default || references.tw || []
  defaultImportReferences.forEach(path => {
    // Handle function calls - tw(...)
    if (path.container.type === 'CallExpression') {
      const callExpression = path.findParent(x => x.isCallExpression())
      if (!callExpression) return

      // Handle arrays - tw([...])
      const nodeExpression = callExpression.get('arguments')[0].node
      if (!nodeExpression) return

      if (
        ['ArrayExpression', 'ArrowFunctionExpression'].includes(
          nodeExpression.type
        )
      ) {
        const elements =
          (nodeExpression.body && nodeExpression.body.elements) ||
          nodeExpression.elements
        assert(isEmpty(elements), () =>
          logErrorGood(
            `The tw import can’t be called that way`,
            `tw(() => [...]) / tw([...])${
              state.cssImport.from.includes('styled-components')
                ? `\n\n💅 Styled Components tip: Use an arrow function or only the first array item will work, eg: tw(() => [...])`
                : ''
            }`
          )
        )

        convertTwArrayElements(elements, state, t)
        updateCssReferences(path, state)
        state.shouldImportCss = true
        return
      }
    }

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

    replaceWithLocation(parsed.path, astify(getStyles(rawClasses, state), t))
  })
}

export { handleTwProperty, handleTwFunction }
