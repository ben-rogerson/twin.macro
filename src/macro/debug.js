const addDebugProperty = ({
  t,
  attributes,
  rawClasses,
  program,
  path,
  state,
}) => {
  if (state.isProd || !state.debugProp) return

  // Remove the existing debug attribute if you happen to have it
  const debugProperty = attributes.filter(
    p => p.node.name && p.node.name.name === 'data-tw'
  )
  debugProperty.forEach(path => path.remove())
  // Add the attribute
  path.insertAfter(
    t.jsxAttribute(t.jsxIdentifier('data-tw'), t.stringLiteral(rawClasses))
  )
}

export default addDebugProperty
