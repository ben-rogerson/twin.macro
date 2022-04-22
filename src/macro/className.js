import { throwIf } from './../utils'
import { logGeneralError } from './../logging'
import { addDataTwPropToPath, addDataPropToExistingPath } from './debug'
import getStyleData from './../getStyleData'
import {
  getParentJSX,
  getAttributeNames,
  getCssAttributeData,
} from './../macroHelpers'

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

  const { astStyles, mismatched, matched } = getStyleData(rawClasses, {
    silentMismatches: true,
    t,
    state,
  })
  if (!matched) return

  // When classes can't be matched we add them back into the className (it exists as a few properties)
  path.node.value.value = mismatched
  path.node.value.extra.rawValue = mismatched
  path.node.value.extra.raw = `"${mismatched}"`

  const jsxPath = getParentJSX(path)
  const attributes = jsxPath.get('attributes')
  const { attribute: cssAttribute } = getCssAttributeData(attributes)

  if (!cssAttribute) {
    const attribute = makeJsxAttribute(['css', astStyles], t)
    mismatched ? path.insertAfter(attribute) : path.replaceWith(attribute)
    addDataTwPropToPath({ t, attributes, rawClasses: matched, path, state })
    return
  }

  const cssExpression = cssAttribute.get('value').get('expression')
  const attributeNames = getAttributeNames(jsxPath)

  const isBeforeCssAttribute =
    attributeNames.indexOf('className') - attributeNames.indexOf('css') < 0

  if (cssExpression.isArrayExpression()) {
    //  The existing css prop is an array, eg: css={[...]}
    isBeforeCssAttribute
      ? cssExpression.unshiftContainer('elements', astStyles)
      : cssExpression.pushContainer('elements', astStyles)
  } else {
    // The existing css prop is not an array, eg: css={{ ... }} / css={`...`}
    const existingCssAttribute = cssExpression.node
    throwIf(!existingCssAttribute, () =>
      logGeneralError(
        `An empty css prop (css="") isn’t supported alongside the className prop`
      )
    )
    const styleArray = isBeforeCssAttribute
      ? [astStyles, existingCssAttribute]
      : [existingCssAttribute, astStyles]
    cssExpression.replaceWith(t.arrayExpression(styleArray))
  }

  if (!mismatched) path.remove()

  addDataPropToExistingPath({
    t,
    attributes,
    rawClasses: matched,
    path: jsxPath,
    state,
  })
}

export { handleClassNameProperty }
