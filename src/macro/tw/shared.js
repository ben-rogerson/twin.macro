import dlv from 'dlv'
import { parseTte, replaceWithLocation, astify } from './../../macroHelpers'
import { throwIf, isEmpty } from './../../utils'
import {
  logErrorGood,
  logTwImportUsageError,
  logTwWrappedImportUsageError,
} from './../../logging'
import getStyles from './../../getStyles'

const setValueByNodeType = type =>
  ({
    StringLiteral: (node, state) => {
      node.value = getStyles(node.get('value').node, state)
    },
    // ``
    TemplateElement: (node, state, t) => {
      const rawValue = node.get('value').get('raw').node
      const styles = getStyles(rawValue, state)
      // const nodeLoc = node.get('loc').node
      // console.log({ nodeLoc })
      /**
       * Up to here
       * Attempted to replace the node.value with the style object
       * it compiled the the right output but didn't work when using with webpack.
       * Refactored to use the node traversal functions instead so I could use
       * the replacement function but got the same result.
       */
      const astifiedStyles = astify(styles, t)
      replaceWithLocation(node, astifiedStyles)

      // console.log({ typ: node })
      // node.node.loc = nodeLoc
      // node.node.type = 'StringLiteral'
      // node.node.value = styles
      // console.log({ node })
    },
    TemplateLiteral: (node, state) => {
      const styles = getStyles(dlv(node, 'quasis.0.value.raw'), state)
      // Convert node to a stringLiteral
      node.value = styles
      node.type = 'StringLiteral'
      // Clean up data from old node type
      delete node.quasis
      delete node.expressions
    },
    LogicalExpression: (node, state, t) => {
      throwIf(node.right.type === 'ArrayExpression', () =>
        logErrorGood(
          'Nested sub arrays aren’t supported',
          `tw([isDark && 'block'])`
        )
      )
      return setValueByNodeType(node.right.type)(node.right, state, t)
    },
    ConditionalExpression: (node, state, t) => {
      throwIf(
        [node.consequent.type, node.alternate.type].includes('ArrayExpression'),
        () =>
          logErrorGood(
            'Nested sub arrays aren’t supported',
            `tw([isDark ? 'block' : 'bg-white'])`
          )
      )
      return [
        setValueByNodeType(node.consequent.type)(node.consequent, state, t),
        setValueByNodeType(node.alternate.type)(node.alternate, state, t),
      ]
    },
    NullLiteral: () => null,
  }[type] || (() => ({})))

const convertTwArrayElements = (elements, state, t, path) => {
  if (elements.length === 0) return
  elements.map(node => setValueByNodeType(node.type)(node, state, t, path))
}

const getStyleNode = type =>
  ({
    // tw(WrappedComponent) / tw={WrappedComponent}
    Identifier: ({ e }) => [e],
    // tw['']
    StringLiteral: ({ e }) => [e],
    TemplateElement: ({ e }) => [e],
    TemplateLiteral: ({ e }) => e.get('quasis')[0],
    // tw['', '']
    SequenceExpression: ({ e }) => e.expressions,
    // tw(() => true && [''])
    LogicalExpression: ({ e, ...rest }) =>
      getStyleNode(e.right.type)({ e: e.right, ...rest }),
    // tw.div[() => (true ? '' : '')] / tw={[() => (true ? '' : '')]}
    ConditionalExpression: ({ e, ...rest }) => [
      ...getStyleNode(e.consequent.type)({ e: e.consequent, ...rest }),
      ...getStyleNode(e.alternate.type)({ e: e.alternate, ...rest }),
    ],
    // tw(() => ['']) / tw={['']}
    ArrayExpression: ({ e, ...rest }) => {
      const elements = e.get('elements')
      const trans = elements.map(element =>
        getStyleNode(element.type)({ e: element, ...rest })
      )
      return trans
    },
    // tw[() => '']
    ArrowFunctionExpression: ({ e, ...rest }) => {
      const { body } = e

      throwIf(
        ![
          'ArrayExpression', // tw[() => '']
          'LogicalExpression', // tw[() => true && '']
          'ConditionalExpression', // tw[() => true ? '' : '']
        ].includes(body.type),
        () => logTwImportUsageError
      )
      return getStyleNode(body.type)({ e: body, ...rest })
    },
    // tw={...}
    JSXExpressionContainer: ({ e, ...rest }) => {
      const node = e.expression
      return getStyleNode(node.type)({ e: node, ...rest })
    },
    // tw``
    TaggedTemplateExpression: ({ e, state, t }) => {
      throwIf(!e.findParent, () => logTwImportUsageError)

      const parent = e.findParent(x => x.isTaggedTemplateExpression())

      throwIf(
        !['Identifier', 'MemberExpression', 'CallExpression'].includes(
          parent.node.tag.type
        ),
        () =>
          logErrorGood(
            'Any conditionals must be within an array',
            `tw([isBlock && \`block\`])`
          )
      )

      // Replace tw with external lib imports
      const parsed = parseTte({ path: parent, types: t, state })
      if (isEmpty(parsed)) return

      const styles = getStyles(parsed.string, state)

      const astifiedStyles = astify(styles, t)
      replaceWithLocation(parsed.path, astifiedStyles)
      return styles // TODO: use this?
    },
    // tw()
    CallExpression: ({ e, state, t }) => {
      const callExpression = e.findParent(p => p.isCallExpression())
      const argumentz = callExpression.get('arguments.0') // arguments === restricted var name
      const { node } = argumentz

      // tw(WrappedComponent)
      if (argumentz.type === 'Identifier') {
        e.node.name = '_styled' // TODO: Replace with identifier
        state.shouldImportStyled = true

        // tw(MyStyledComponent)`block`
        const subCall = e.findParent(p => p.isTaggedTemplateExpression())

        throwIf(!subCall, () =>
          logErrorGood(
            'Wrapped components must be styled with template literals:',
            'tw(MyStyledComponent)`block`'
          )
        )

        // Use legacy handler for tagged templates
        getStyleNode('TaggedTemplateExpression')({ e, state, t })
        return
      }

      throwIf(
        ![
          'Identifier', // tw(block)
          'StringLiteral', // tw('block')
          'TemplateLiteral', // tw(`block`)
          'ArrayExpression', // tw([block])
          'LogicalExpression', // tw(true && [block])
          'ConditionalExpression', // tw(true ? [block] : [bg-white])
          'ArrowFunctionExpression', // tw(() => [block]) / tw(() => `block`) / tw(() => [`block`]) / tw(() => true && [`block`])
        ].includes(argumentz.type),
        () => logTwImportUsageError
      )

      return getStyleNode(node.type)({ e: node })
    },
    // tw.div`` / tw.div()
    MemberExpression: ({ e, state, t }) => {
      // const { parent } = e.findParent(p => p.isMemberExpression())
      // TODO: Finish fixing paths after changing this
      const parent = e.findParent(p => p.isMemberExpression()).parentPath

      throwIf(
        ![
          'CallExpression', // tw.div()
          'TaggedTemplateExpression', // tw.div``
        ].includes(parent.type),
        () => logTwWrappedImportUsageError
      )

      /**
       * Tagged template expressions
       * eg: tw.div``
       * This runs on a legacy handler
       */
      if (parent.type === 'TaggedTemplateExpression') {
        getStyleNode(parent.type)({ e, state, t })
        return
      }

      const node = parent.get('arguments')[0]

      throwIf(
        ![
          'Identifier', // tw.div(WrappedComponent)
          'ArrayExpression', // tw.div(["..."])
          'ArrowFunctionExpression', // tw.div(() => ["..."])
        ].includes(node.type),
        () => logTwWrappedImportUsageError
      )

      const { styledIdentifier } = state
      const cloneNode = t.cloneNode || t.cloneDeep

      const nodeLoc = e.parentPath.get('object').node.loc
      replaceWithLocation(
        e.parentPath.get('object'),
        cloneNode(styledIdentifier)
      )
      state.shouldImportStyled = true

      // TODO: Find out why loc is applied on the output
      e.parentPath.get('object').node.loc = nodeLoc

      // tw.div(["..."])
      if (node.type === 'ArrayExpression') {
        // TODO: Auto arrowFunctionExpression with styled-components
        throwIf(state.isStyledComponents, () =>
          logErrorGood(
            'Arrays need an arrow function when using styled-components',
            "tw.div(() => ['...'])"
          )
        )
        return getStyleNode(node.type)({ e: node })
      }

      // tw.div(() => ["..."])
      if (node.type === 'ArrowFunctionExpression') {
        const body = node.get('body')
        return getStyleNode(body.type)({ e: body })
      }
    },
  }[type] || (() => ({})))

export { getStyleNode, convertTwArrayElements }
