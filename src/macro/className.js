import { throwIf } from './../utils'
import { logGeneralError } from './../logging'
import { addDataTwPropToPath, addDataTwPropToExistingPath } from './debug'
import getStyleData from './../getStyleData'

const getParentJSX = path => path.findParent(p => p.isJSXOpeningElement())

const getAttributeNames = jsxPath => {
  const attributes = jsxPath.get('attributes')
  const attributeNames = attributes.map(p => p.node.name && p.node.name.name)
  return attributeNames
}

const makeJsxAttribute = ([key, value], t) =>
  t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(value))

const handleClassNameProperty = ({ path, t, state }) => {
  if (!state.configTwin.includeClassNames) return
  if (path.node.name.name !== 'className') return

  const nodeValue = path.node.value

  // Ignore className if it cannot be resolved
  if (nodeValue.expression) return

  const rawClasses = nodeValue.value || ''
  if (!rawClasses) return

  const { styles, mismatched, matched } = getStyleData(
    rawClasses,
    t,
    state,
    true
  )
  if (!matched) return

  // When classes can't be matched we add them back into the className (it exists as a few properties)
  path.node.value.value = mismatched
  path.node.value.extra.rawValue = mismatched
  path.node.value.extra.raw = `"${mismatched}"`

  const jsxPath = getParentJSX(path)
  const attributes = jsxPath.get('attributes')
  const cssAttributes = attributes.filter(
    p => p.node.name && p.node.name.name === 'css'
  )

  if (cssAttributes.length === 0) {
    const attribute = makeJsxAttribute(['css', styles], t)
    mismatched ? path.insertAfter(attribute) : path.replaceWith(attribute)
    addDataTwPropToPath({ t, attributes, rawClasses: matched, path, state })
    return
  }

  const cssExpression = cssAttributes[0].get('value').get('expression')
  const attributeNames = getAttributeNames(jsxPath)
  const isBeforeTwAttribute =
    attributeNames.indexOf('className') - attributeNames.indexOf('tw') < 0
  const isBeforeCssAttribute =
    attributeNames.indexOf('className') - attributeNames.indexOf('css') < 0

  if (cssExpression.isArrayExpression()) {
    //  The existing css prop is an array, eg: css={[...]}
    isBeforeTwAttribute || isBeforeCssAttribute
      ? cssExpression.unshiftContainer('elements', styles)
      : cssExpression.pushContainer('elements', styles)
  } else {
    // The existing css prop is not an array, eg: css={{ ... }} / css={`...`}
    const existingCssAttribute = cssExpression.node
    throwIf(!existingCssAttribute, () =>
      logGeneralError(
        `An empty css prop (css="") isn’t supported alongside the className prop`
      )
    )
    const styleArray =
      isBeforeTwAttribute || isBeforeCssAttribute
        ? [styles, existingCssAttribute]
        : [existingCssAttribute, styles]
    cssExpression.replaceWith(t.arrayExpression(styleArray))
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
