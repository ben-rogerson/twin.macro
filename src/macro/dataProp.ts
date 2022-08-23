import type { AddDataPropToExistingPath, T } from './types'

const SPACE_ID = '_'
const EXTRA_WHITESPACE = /\s\s+/g
const LINEFEED = /\n/g

function formatProp(classes: string): string {
  return (
    classes
      // Normalize spacing
      .replace(EXTRA_WHITESPACE, ' ')
      // Remove newline characters
      .replace(LINEFEED, ' ')
      // Replace the space id
      .replace(SPACE_ID, ' ')
      .trim()
  )
}

function addDataTwPropToPath({
  t,
  attributes,
  rawClasses,
  path,
  state,
  coreContext,
  propName = 'data-tw',
}: AddDataPropToExistingPath): void {
  const dataTwPropAllEnvironments =
    propName === 'data-tw' && coreContext.twinConfig.dataTwProp === 'all'
  const dataCsPropAllEnvironments =
    propName === 'data-cs' && coreContext.twinConfig.dataCsProp === 'all'
  if (!state.isDev && !dataTwPropAllEnvironments && !dataCsPropAllEnvironments)
    return
  if (propName === 'data-tw' && !coreContext.twinConfig.dataTwProp) return
  if (propName === 'data-cs' && !coreContext.twinConfig.dataCsProp) return

  // A for in loop looping over attributes and removing the one we want
  for (const p of attributes) {
    if (p.type === 'JSXSpreadAttribute') continue
    const nodeName = p.node as T.JSXAttribute
    if (nodeName?.name && nodeName.name.name === propName) p.remove()
  }

  const classes = formatProp(rawClasses)

  // Add the attribute
  path.insertAfter(
    t.jsxAttribute(t.jsxIdentifier(propName), t.stringLiteral(classes))
  )
}

function addDataPropToExistingPath({
  t,
  attributes,
  rawClasses,
  path,
  state,
  coreContext,
  propName = 'data-tw',
}: AddDataPropToExistingPath): void {
  const dataTwPropAllEnvironments =
    propName === 'data-tw' && coreContext.twinConfig.dataTwProp === 'all'
  const dataCsPropAllEnvironments =
    propName === 'data-cs' && coreContext.twinConfig.dataCsProp === 'all'
  if (!state.isDev && !dataTwPropAllEnvironments && !dataCsPropAllEnvironments)
    return
  if (propName === 'data-tw' && !coreContext.twinConfig.dataTwProp) return
  if (propName === 'data-cs' && !coreContext.twinConfig.dataCsProp) return

  // Append to the existing debug attribute
  const dataProperty = attributes.find(
    p =>
      (p.node as T.JSXAttribute)?.name &&
      (p.node as T.JSXAttribute).name.name === propName
  )

  if (dataProperty) {
    try {
      // Existing data prop
      if (
        ((dataProperty.node as T.JSXAttribute).value as T.StringLiteral).value
      ) {
        ;(
          (dataProperty.node as T.JSXAttribute).value as T.StringLiteral
        ).value = `${[
          ((dataProperty.node as T.JSXAttribute).value as T.StringLiteral)
            .value,
          rawClasses,
        ]
          .filter(Boolean)
          .join(' | ')}`
        return
      }

      // New data prop
      const attribute = (dataProperty.node as T.JSXAttribute)
        .value as T.JSXExpressionContainer
      // @ts-expect-error Setting value on target
      attribute.expression.value = `${[
        // @ts-expect-error Okay with value not on all expression types
        (dataProperty.node.value as T.JSXExpressionContainer).expression.value,
        rawClasses,
      ]
        .filter(Boolean)
        .join(' | ')}`
    } catch (_: unknown) {}

    return
  }

  const classes = formatProp(rawClasses)

  // Add a new attribute
  path.pushContainer(
    // @ts-expect-error Key is never
    'attributes',
    t.jSXAttribute(
      t.jSXIdentifier(propName),
      t.jSXExpressionContainer(t.stringLiteral(classes))
    )
  )
}

export { addDataTwPropToPath, addDataPropToExistingPath }
