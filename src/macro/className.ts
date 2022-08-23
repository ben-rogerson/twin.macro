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
import type { JSXAttributeHandler, T, NodePath } from './types'

function makeJsxAttribute(
  [key, value]: [string, T.Expression | T.JSXEmptyExpression],
  t: typeof T
): T.JSXAttribute {
  return t.jsxAttribute(t.jsxIdentifier(key), t.jsxExpressionContainer(value))
}

function handleClassNameProperty({
  path,
  t,
  state,
  coreContext,
}: JSXAttributeHandler): void {
  if (!coreContext.twinConfig.includeClassNames) return
  if (path.node.name.name !== 'className') return

  const nodeValue = path.node.value
  if (!nodeValue) return

  // Ignore className if it cannot be resolved
  if ((nodeValue as T.JSXExpressionContainer).expression) return

  const rawClasses = (nodeValue as T.StringLiteral).value
  if (!rawClasses) return

  const { styles, unmatched, matched } = getStyles(rawClasses, {
    ...coreContext,
    isSilent: true,
  })
  if (matched.length === 0) return

  const astStyles = astify(isEmpty(styles) ? {} : styles, t)

  // When classes can't be matched we add them back into the className (it exists as a few properties)
  const unmatchedClasses = unmatched.join(' ')
  if (!path.node.value) return

  // @ts-expect-error Setting value on target
  path.node.value.value = unmatchedClasses
  if (path.node.value.extra) {
    path.node.value.extra.rawValue = unmatchedClasses
    path.node.value.extra.raw = `"${unmatchedClasses}"`
  }

  const jsxPath = getParentJSX(path)
  const attributes = jsxPath.get('attributes')
  const { attribute: cssAttribute } = getCssAttributeData(attributes)

  if (!cssAttribute) {
    const attribute = makeJsxAttribute(['css', astStyles], t)
    if (unmatchedClasses) {
      path.insertAfter(attribute)
    } else {
      path.replaceWith(attribute)
    }

    const pathParameters = {
      t,
      path,
      state,
      attributes,
      coreContext,
      rawClasses: matched.join(' '),
    }

    addDataTwPropToPath(pathParameters)
    return
  }

  const cssExpression = (cssAttribute as NodePath<T.JSXAttribute>)
    .get('value')
    .get('expression') as NodePath<T.Expression>
  const attributeNames = getAttributeNames(jsxPath)

  const isBeforeCssAttribute =
    attributeNames.indexOf('className') - attributeNames.indexOf('css') < 0

  if (cssExpression.isArrayExpression()) {
    // The existing css prop is an array, eg: css={[...]}
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

  if (!unmatchedClasses) path.remove()

  addDataPropToExistingPath({
    t,
    attributes,
    rawClasses: matched.join(' '),
    path: jsxPath,
    state,
    coreContext,
  })
}

export { handleClassNameProperty }
