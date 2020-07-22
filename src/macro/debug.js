/* eslint-disable-next-line unicorn/prevent-abbreviations */
const addDebugPropToPath = ({ t, attributes, rawClasses, path, state }) => {
  if (state.isProd || !state.debugProp) return

  // Remove the existing debug attribute if you happen to have it
  const debugProperty = attributes.filter(
    p => p.node && p.node.name && p.node.name.name === 'data-tw'
  )
  debugProperty.forEach(path => path.remove())

  // Add the attribute
  path.insertAfter(
    t.jsxAttribute(t.jsxIdentifier('data-tw'), t.stringLiteral(rawClasses))
  )
}

/* eslint-disable-next-line unicorn/prevent-abbreviations */
const addDebugPropToExistingPath = ({
  t,
  attributes,
  rawClasses,
  path,
  state,
}) => {
  if (state.isProd || !state.debugProp) return

  // Remove the existing debug attribute if you happen to have it
  const debugProperty = attributes.filter(
    p => p.node && p.node.name && p.node.name.name === 'data-tw'
  )
  debugProperty.forEach(path => path.remove())

  // Add the attribute
  path.pushContainer(
    'attributes',
    t.jSXAttribute(
      t.jSXIdentifier('data-tw'),
      t.jSXExpressionContainer(t.stringLiteral(rawClasses))
    )
  )
}

export { addDebugPropToPath, addDebugPropToExistingPath }
