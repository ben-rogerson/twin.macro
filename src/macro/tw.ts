// eslint-disable-next-line import/no-relative-parent-imports
import { getStyles } from '../core'
// eslint-disable-next-line import/no-relative-parent-imports
import getSuggestions from '../suggestions'
import {
  astify,
  getParentJSX,
  parseTte,
  replaceWithLocation,
  getAttributeNames,
  getCssAttributeData,
  makeStyledComponent,
} from './lib/astHelpers'
import isEmpty from './lib/util/isEmpty'
import { addDataTwPropToPath, addDataPropToExistingPath } from './dataProp'
import type {
  AdditionalHandlerParameters,
  CoreContext,
  JSXAttributeHandler,
  NodePath,
  State,
  T,
} from './types'

type MoveTwPropToStyled = {
  t: typeof T
  state: State
  program: NodePath<T.Program>
  astStyles: T.Expression
  jsxPath: NodePath<T.JSXOpeningElement>
  coreContext: CoreContext
}

function moveTwPropToStyled(params: MoveTwPropToStyled): void {
  const { jsxPath, astStyles } = params

  makeStyledComponent({ ...params, secondArg: astStyles })

  // Remove the tw attribute
  const tagAttributes = jsxPath.node.attributes
  const twAttributeIndex = tagAttributes.findIndex(
    n => n.type === 'JSXAttribute' && n.name && n.name.name === 'tw'
  )
  if (twAttributeIndex < 0) return

  jsxPath.node.attributes.splice(twAttributeIndex, 1)
}

type MergeIntoCssAttribute = {
  t: typeof T
  path: NodePath<T.JSXOpeningElement>
  astStyles: T.Expression
  cssAttribute: NodePath<T.JSXAttribute> | undefined
}

function mergeIntoCssAttribute({
  t,
  path,
  astStyles,
  cssAttribute,
}: MergeIntoCssAttribute): void {
  if (!cssAttribute) return

  // The expression is the value as a NodePath
  const attributeValuePath = cssAttribute.get('value')

  // If it's not {} or "", get out of here
  if (
    !attributeValuePath ||
    (!attributeValuePath.isJSXExpressionContainer() &&
      !attributeValuePath.isStringLiteral())
  )
    return

  const existingCssAttribute = attributeValuePath.isStringLiteral()
    ? (attributeValuePath as unknown as NodePath<T.StringLiteral>)
    : // @ts-expect-error get doesn’t exist on the types
      (attributeValuePath.get(
        'expression'
      ) as NodePath<T.JSXExpressionContainer>)

  const attributeNames = getAttributeNames(path)

  const isBeforeCssAttribute =
    attributeNames.indexOf('tw') - attributeNames.indexOf('css') < 0

  if (existingCssAttribute.isArrayExpression()) {
    // The existing css prop is an array, eg: css={[...]}
    if (isBeforeCssAttribute) {
      const attribute = existingCssAttribute as NodePath<
        T.StringLiteral | T.JSXExpressionContainer
      >
      // @ts-expect-error never in arg0?
      attribute.unshiftContainer('elements', astStyles)
    } else {
      const attribute = existingCssAttribute as NodePath<
        T.StringLiteral | T.JSXExpressionContainer
      >
      // @ts-expect-error never in arg0?
      attribute.pushContainer('elements', astStyles)
    }
  } else {
    // css prop is either:
    // TemplateLiteral
    // <div css={`...`} tw="..." />
    // or an ObjectExpression
    // <div css={{ ... }} tw="..." />
    // or ArrowFunctionExpression/FunctionExpression
    // <div css={() => (...)} tw="..." />
    const existingCssAttributeNode = existingCssAttribute.node

    // The existing css prop is an array, eg: css={[...]}
    const styleArray = isBeforeCssAttribute
      ? [astStyles, existingCssAttributeNode]
      : [existingCssAttributeNode, astStyles]

    const arrayExpression = t.arrayExpression(styleArray as T.Expression[])

    const { parent } = existingCssAttribute
    const replacement =
      parent.type === 'JSXAttribute'
        ? t.jsxExpressionContainer(arrayExpression)
        : arrayExpression

    existingCssAttribute.replaceWith(replacement)
  }
}

function handleTwProperty({
  path,
  t,
  program,
  state,
  coreContext,
}: JSXAttributeHandler): void {
  if (!path.node || path.node.name.name !== 'tw') return
  state.hasTwAttribute = true

  const nodeValue = path.node.value
  if (!nodeValue) return

  const nodeExpression = (nodeValue as T.JSXExpressionContainer).expression

  // Handle `tw={"block"}`
  const expressionValue =
    nodeExpression &&
    nodeExpression.type === 'StringLiteral' &&
    nodeExpression.value
  if (expressionValue === '') return // Allow `tw={""}`

  // Feedback for unsupported usage
  if (nodeExpression)
    coreContext.assert(
      Boolean(expressionValue),
      ({ color }) =>
        `${color(
          `✕ Only plain strings can be used with the "tw" prop`
        )}\n\nTry using it like this: ${color(
          `<div tw="text-black" />`,
          'success'
        )} or ${color(
          `<div tw={"text-black"} />`,
          'success'
        )}\n\nRead more at https://twinredirect.page.link/template-literals`
    )

  const rawClasses =
    expressionValue || (nodeValue as T.StringLiteral).value || ''
  const { styles, unmatched } = getStyles(rawClasses, coreContext)

  if (unmatched.length > 0) {
    getSuggestions(unmatched, {
      CustomError: coreContext.CustomError,
      tailwindContext: coreContext.tailwindContext,
      tailwindConfig: coreContext.tailwindConfig,
      hasLogColors: coreContext.twinConfig.hasLogColors,
    })
    return
  }

  const astStyles = astify(isEmpty(styles) ? {} : styles, t)

  const jsxPath = getParentJSX(path)
  const attributes = jsxPath.get('attributes')
  const { attribute: cssAttribute } = getCssAttributeData(attributes)

  if (coreContext.twinConfig.moveTwPropToStyled) {
    moveTwPropToStyled({ astStyles, jsxPath, t, program, state, coreContext })
    addDataTwPropToPath({ t, attributes, rawClasses, path, state, coreContext })
    return
  }

  if (!cssAttribute) {
    // Replace the tw prop with the css prop
    path.replaceWith(
      t.jsxAttribute(
        t.jsxIdentifier('css'),
        t.jsxExpressionContainer(astStyles)
      )
    )
    addDataTwPropToPath({ t, attributes, rawClasses, path, state, coreContext })
    return
  }

  // Merge tw styles into an existing css prop
  mergeIntoCssAttribute({
    cssAttribute: cssAttribute as NodePath<T.JSXAttribute>,
    path: jsxPath,
    astStyles,
    t,
  })

  path.remove() // remove the tw prop

  addDataPropToExistingPath({
    t,
    attributes,
    rawClasses,
    path: jsxPath,
    coreContext,
    state,
  })
}

function handleTwFunction({
  references,
  t,
  state,
  coreContext,
}: AdditionalHandlerParameters): void {
  const defaultImportReferences = references.default || references.tw || []

  defaultImportReferences.forEach(path => {
    /**
     * Gotcha: After twin changes a className/tw/cs prop path then the reference
     * becomes stale and needs to be refreshed with crawl()
     */
    const { parentPath } = path
    if (!(parentPath as NodePath).isTaggedTemplateExpression())
      path.scope.crawl()

    const parent = path.findParent(x =>
      x.isTaggedTemplateExpression()
    ) as NodePath<T.TaggedTemplateExpression>
    if (!parent) return

    // Check if the style attribute is being used
    if (!coreContext.twinConfig.allowStyleProp) {
      const jsxAttribute = parent.findParent(x =>
        x.isJSXAttribute()
      ) as NodePath<T.JSXAttribute>
      const attributeName =
        // @ts-expect-error No `get` on resulting path
        jsxAttribute && (jsxAttribute.get('name').get('name').node as string)

      coreContext.assert(
        attributeName !== 'style',
        ({ color }) =>
          `${color(
            `✕ Tailwind styles shouldn’t be added within a \`style={...}\` prop`
          )}\n\nUse the tw or css prop instead: ${color(
            '<div tw="" />',
            'success'
          )} or ${color(
            '<div css="" />',
            'success'
          )}\n\nDisable this error by adding this in your twin config: \`{ "allowStyleProp": true }\`\nRead more at https://twinredirect.page.link/style-prop`
      )
    }

    const parsed = parseTte(parent, { t, state })
    if (!parsed) return

    const rawClasses = parsed.string
    // Add tw-prop for css attributes
    const jsxPath = path.findParent(p =>
      p.isJSXOpeningElement()
    ) as NodePath<T.JSXOpeningElement>

    if (jsxPath) {
      const attributes = jsxPath.get('attributes')
      const pathData = {
        t,
        attributes,
        rawClasses,
        path: jsxPath,
        coreContext,
        state,
      }
      addDataPropToExistingPath(pathData)
    }

    const { styles, unmatched } = getStyles(rawClasses, coreContext)

    if (unmatched.length > 0) {
      getSuggestions(unmatched, {
        CustomError: coreContext.CustomError,
        tailwindContext: coreContext.tailwindContext,
        tailwindConfig: coreContext.tailwindConfig,
        hasLogColors: coreContext.twinConfig.hasLogColors,
      })
      return
    }

    const astStyles = astify(isEmpty(styles) ? {} : styles, t)
    replaceWithLocation(parsed.path, astStyles)
  })
}

export { handleTwProperty, handleTwFunction }
