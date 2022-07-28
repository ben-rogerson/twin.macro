// eslint-disable-next-line import/no-relative-parent-imports
import { getStyles } from '../core'
import { addDataTwPropToPath, addDataPropToExistingPath } from './dataProp'
import throwIf from './lib/util/throwIf'
import isEmpty from './lib/util/isEmpty'
import { logGeneralError } from './lib/logging'
import {
  astify,
  getParentJSX,
  getAttributeNames,
  getCssAttributeData,
} from './lib/astHelpers'

const makeJsxAttribute = ([key, value], t) =>
  t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(value))

const handleClassNameProperty = ({ path, t, state, coreContext }) => {
  if (!state.configTwin.includeClassNames) return
  if (path.node.name.name !== 'className') return

  const nodeValue = path.node.value

  // Ignore className if it cannot be resolved
  if (nodeValue.expression) return

  const rawClasses = nodeValue.value || ''
  if (!rawClasses) return

  let { styles, unmatched, matched } = getStyles(rawClasses, {
    ...coreContext,
    isSilent: true,
  })

  unmatched = unmatched.join(' ')
  matched = matched.join(' ')

  const astStyles = astify(isEmpty(styles) ? {} : styles, t)
  if (!matched) return

  // When classes can't be matched we add them back into the className (it exists as a few properties)
  path.node.value.value = unmatched
  path.node.value.extra.rawValue = unmatched
  path.node.value.extra.raw = `"${unmatched}"`

  const jsxPath = getParentJSX(path)
  const attributes = jsxPath.get('attributes')
  const { attribute: cssAttribute } = getCssAttributeData(attributes)

  if (!cssAttribute) {
    const attribute = makeJsxAttribute(['css', astStyles], t)
    if (unmatched) {
      path.insertAfter(attribute)
    } else {
      path.replaceWith(attribute)
    }

    addDataTwPropToPath({ t, attributes, rawClasses: matched, path, state })
    return
  }

  const cssExpression = cssAttribute.get('value').get('expression')
  const attributeNames = getAttributeNames(jsxPath)

  const isBeforeCssAttribute =
    attributeNames.indexOf('className') - attributeNames.indexOf('css') < 0

  if (cssExpression.isArrayExpression()) {
    //  The existing css prop is an array, eg: css={[...]}
    if (isBeforeCssAttribute) {
      cssExpression.unshiftContainer('elements', astStyles)
    } else {
      cssExpression.pushContainer('elements', astStyles)
    }
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

  if (!unmatched) path.remove()

  addDataPropToExistingPath({
    t,
    attributes,
    rawClasses: matched,
    path: jsxPath,
    state,
  })
}

export { handleClassNameProperty }
