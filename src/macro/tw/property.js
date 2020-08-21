import dlv from 'dlv'
import { astify } from './../../macroHelpers'
import { throwIf, isEmpty } from './../../utils'
import { logGeneralError, logTwPropertyUsageError } from './../../logging'
/* eslint-disable-next-line unicorn/prevent-abbreviations */
import { addDebugPropToPath, addDebugPropToExistingPath } from './../debug'
import getStyles from './../../getStyles'
import { getStyleNode, convertTwArrayElements } from './shared'

const handleTwPropertyValue = {
  StringLiteral: ({ value }) => value,
  TemplateElement: ({ value }) => value.raw,
}

const getTwPropertyHandler = type => context =>
  (dlv(handleTwPropertyValue, type) || (() => ({})))(context)

const handleTwPropertySpecialValue = {
  // tw={blah}
  Identifier: ({ path }) => {
    path.node.name.name = 'css'
  },
  // tw={() => blah}
  CallExpression: ({ path }) => {
    path.node.name.name = 'css'
  },
  // tw={['block']}
  ArrayExpression: ({ path, state, t }) => {
    const nodeValue = path.node.value
    const nodeExpressions = getStyleNode(nodeValue.type)({ e: nodeValue })
    convertTwArrayElements(nodeExpressions, state, t, path)
    path.node.name.name = 'css'
  },
}

const twPropertySpecialHandler = type => context =>
  (dlv(handleTwPropertySpecialValue, type) || (() => ({})))(context)

const handleTwProperty = ({ program, state, t }) =>
  program.traverse({
    JSXAttribute(path) {
      if (path.node.name.name === 'css') state.hasCssProp = true
      // TODO: Add tw-prop for css attributes

      if (path.node.name.name !== 'tw') return
      state.hasTwProp = true

      const nodeValue = path.node.value
      const nodeValueType = dlv(nodeValue, 'expression.type')

      throwIf(
        ![
          'Identifier', // tw={blah}
          'StringLiteral', // tw={'block'}
          'TemplateLiteral', // tw={`block`}
          'ArrayExpression', // tw={['block']}
          'CallExpression', // tw={blah()}
          'ArrowFunctionExpression', // tw={() => blah}
        ].includes(nodeValueType) &&
          // tw="block"
          nodeValue.type !== 'StringLiteral',
        () => logTwPropertyUsageError
      )

      if (Object.keys(handleTwPropertySpecialValue).includes(nodeValueType)) {
        twPropertySpecialHandler(nodeValueType)({
          path,
          state,
          t,
        })
        return
      }

      const nodeExpressions = getStyleNode(nodeValue.type)({ e: nodeValue })
      const expression = nodeExpressions[0]
      throwIf(
        !Object.keys(handleTwPropertyValue).includes(expression.type),
        () => logTwPropertyUsageError
      )

      const classes = getTwPropertyHandler(expression.type)(expression)
      const rawClasses = isEmpty(classes) ? '' : classes
      const styles = astify(getStyles(rawClasses, state), t)
      const jsxPath = path.findParent(p => p.isJSXOpeningElement())
      const attributes = jsxPath.get('attributes')
      const cssAttributes = attributes.filter(
        p => dlv(p, 'node.name.name') === 'css'
      )

      if (cssAttributes.length > 0) {
        path.remove()
        const expr = cssAttributes[0].get('value').get('expression')
        if (expr.isArrayExpression()) {
          /**
           * v2? unshiftContainer could also be supported here so we can
           * preserve the original position of the css prop.
           * But it would break the specificity of existing css+tw combinations.
           */
          expr.pushContainer('elements', styles)
        } else {
          throwIf(!expr.node, () =>
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

export { handleTwProperty }
