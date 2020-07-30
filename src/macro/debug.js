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

  // Append to the existing debug attribute
  const debugProperty = attributes.find(
    // TODO: Use @babel/plugin-proposal-optional-chaining
    p => p.node && p.node.name && p.node.name.name === 'data-tw'
  )
  if (debugProperty) {
    try {
      // Existing data-tw
      if (debugProperty.node.value.value) {
        debugProperty.node.value.value = `${debugProperty.node.value.value} | ${rawClasses}`
        return
      }

      // New data-tw
      debugProperty.node.value.expression.value = `${debugProperty.node.value.expression.value} | ${rawClasses}`
    } catch (_) {}

    return
  }

  // Add a new attribute
  path.pushContainer(
    'attributes',
    t.jSXAttribute(
      t.jSXIdentifier('data-tw'),
      t.jSXExpressionContainer(t.stringLiteral(rawClasses))
    )
  )
}

export { addDebugPropToPath, addDebugPropToExistingPath }
