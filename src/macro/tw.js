import { parseTte, replaceWithLocation, astify } from './../macroHelpers'
import { assert, isEmpty } from './../utils'
import {
  logGeneralError,
  logErrorGood,
  logTwImportUsageError,
  logTwPropertyUsageError,
} from './../logging'
/* eslint-disable-next-line unicorn/prevent-abbreviations */
import { addDebugPropToPath, addDebugPropToExistingPath } from './debug'
import getStyles from './../getStyles'
import { updateCssReferences } from './../macro/css'

const setValueByNodeType = type =>
  ({
    StringLiteral: (node, state) => {
      node.value = getStyles(node.value, state)
    },
    TemplateElement: (node, state) => {
      const styles = getStyles(node.value.raw, state)
      node.type = 'StringLiteral'
      node.value = styles
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
    LogicalExpression: (node, state, t) => {
      assert(node.right.type === 'ArrayExpression', () =>
        logErrorGood(
          'Nested sub arrays aren’t supported',
          `tw([isDark && 'bg-black'])`
        )
      )
      return setValueByNodeType(node.right.type)(node.right, state, t)
    },
    ConditionalExpression: (node, state, t) => {
      assert(
        [node.consequent.type, node.alternate.type].includes('ArrayExpression'),
        () =>
          logErrorGood(
            'Nested sub arrays aren’t supported',
            `tw([isDark ? 'bg-black' : 'bg-white'])`
          )
      )
      return [
        setValueByNodeType(node.consequent.type)(node.consequent, state, t),
        setValueByNodeType(node.alternate.type)(node.alternate, state, t),
      ]
    },
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
      // console.log({ nodeExpression: path.node })
      // Feedback for unsupported usage
      assert(nodeExpression && !expressionValue, () => logTwPropertyUsageError)

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
          /**
           * v2? unshiftContainer could also be supported here so we can
           * preserve the original position of the css prop.
           * But it would break the specificity of existing css+tw combinations.
           */
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

const getExpressions = type =>
  ({
    Identifier: ({ e }) => console.log(e.node),
    // tw([() => ''])
    ArrayExpression: ({ e }) => {
      if (e.node.type === 'CallExpression') {
        // getExpressions(e.node.type)({e: })
        // console.log({ args: e.get('arguments') })
        return e.get('arguments.0.elements')
      }

      console.log({ node: e.node })
      return e.node.arguments[0].elements[0]
        ? [e.node.arguments[0].elements[0].body]
        : ['']
    },
    // tw['']
    StringLiteral: ({ e }) => [e.node.property],
    // tw[``]
    TemplateLiteral: ({ e }) => e.container.init.property.quasis,
    // tw['', '']
    SequenceExpression: ({ e }) => e.node.property.expressions,
    // tw[() => '']
    ArrowFunctionExpression: ({ e }) => {
      console.log({ arrayType: e.node.property.body.type })

      if (
        ['StringLiteral', 'TemplateLiteral'].includes(e.node.property.body.type)
      ) {
        return [e.node.property.body]
      }

      // try ? : &&
      return e.node.property.body.expressions // ?
    },
  }[type] || (() => ({})))

const handler = type =>
  ({
    TaggedTemplateExpression: ({ path, state, t }) => {
      const parent = path.findParent(x => x.isTaggedTemplateExpression())
      // assert(isEmpty(parent), () => logTwImportUsageError)

      const parsed = parseTte({
        path: parent,
        types: t,
        styledIdentifier: state.styledIdentifier,
        state,
      })
      if (!parsed) return

      const rawClasses = parsed.string

      replaceWithLocation(parsed.path, astify(getStyles(rawClasses, state), t))
    },
    // tw()
    CallExpression: ({ path, state, t }) => {
      const callExpression = path.findParent(p => p.isCallExpression())

      const expression = callExpression.get('arguments')[0].node
      if (!expression) return

      assert(
        ['ConditionalExpression', 'LogicalExpression'].includes(
          expression.type
        ) ||
          (expression.body && !expression.body.elements),
        () =>
          logErrorGood(
            'Any conditionals must be within an array',
            `tw([isBlock && \`block\`])`
          )
      )

      assert(
        ![
          'StringLiteral',
          'TemplateLiteral',
          'ArrayExpression',
          'ArrowFunctionExpression',
        ].includes(expression.type),
        () => logTwImportUsageError
      )
      console.log({ ype: expression.type })
      const elements = getExpressions(expression.type)({ e: callExpression })

      console.log({ elements })
      // const elements =
      //   (expression.value && [expression]) ||
      //   (expression.body && expression.body.elements) ||
      //   expression.elements ||
      //   expression.quasis
      assert(isEmpty(elements), () => logTwImportUsageError)

      // Convert to an arrow function, required by styled-components
      // eg: this: tw([...]) to this: tw(() => [...])
      state.isStyledComponents &&
        expression.type === 'ArrayExpression' &&
        callExpression.replaceWith(t.arrowFunctionExpression([], expression))

      convertTwArrayElements(elements, state, t)
      updateCssReferences(path, state)

      return elements
    },
    // tw.div`` / tw[]
    MemberExpression: ({ t, state, path }) => {
      const memberExpression = path.findParent(p => p.isMemberExpression())
      const { property } = memberExpression.node

      // console.log({ type: property.type })

      if (property.type === 'Identifier') {
        // console.log(`should remove tw? tw[]`)
        return handler(memberExpression.parent.type)({ path, state, t })
      }

      const expressions = getExpressions(property.type)({ e: memberExpression })

      console.log({ type: property.type, expressions })

      assert(isEmpty(expressions), () => 'error. no expressions')

      // const expressions =
      //   property.type === 'TemplateLiteral'
      //     ? // tw[``]
      //       memberExpression.container.init.property.quasis
      //     : (property.value && [property]) || property.expressions

      // assert(isEmpty(expressions), () => logTwImportUsageError)

      // Convert to an arrow function, required by styled-components
      // eg: this: tw[] to this: tw[() => []]
      state.isStyledComponents &&
        property.type === 'SequenceExpression' &&
        memberExpression.replaceWith(t.arrowFunctionExpression([], property))

      convertTwArrayElements(expressions, state, t)
      updateCssReferences(path, state)

      // console.log({ expressions })
      return expressions
    },
  }[type] || (() => ({})))

const handleTwFunction = ({ references, state, t }) => {
  // TODO: Remove references.tw
  const defaultImportReferences = references.default || references.tw || []
  defaultImportReferences.forEach(path => {
    // console.log({ type: path.container.type })
    assert(
      ![
        'CallExpression',
        'MemberExpression',
        'TaggedTemplateExpression',
      ].includes(path.container.type),
      () => logTwImportUsageError
    )

    // Handle tw() / tw[]
    const elements = handler(path.container.type)({ path, state, t })

    console.log({ is1: 'end', elements, type: path.container.type, is: 'end' })

    // return

    // if (isEmpty(elements)) {
    // }

    // if (!isEmpty(elements)) {
    //   convertTwArrayElements(elements, state, t)
    //   updateCssReferences(path, state)
    //   return
    // }

    // // Handle tw`` / tw.div``
    // const parent = path.findParent(x => x.isTaggedTemplateExpression())
    // assert(isEmpty(parent), () => logTwImportUsageError)

    // const parsed = parseTte({
    //   path: parent,
    //   types: t,
    //   styledIdentifier: state.styledIdentifier,
    //   state,
    // })
    // if (!parsed) return

    // const rawClasses = parsed.string

    // replaceWithLocation(parsed.path, astify(getStyles(rawClasses, state), t))
  })
}

export { handleTwProperty, handleTwFunction }
