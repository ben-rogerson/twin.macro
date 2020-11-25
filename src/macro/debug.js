/* eslint-disable-next-line unicorn/prevent-abbreviations */
const addDataTwPropToPath = ({ t, attributes, rawClasses, path, state }) => {
  if (state.isProd || !state.configTwin.dataTwProp) return

  // Remove the existing debug attribute if you happen to have it
  const dataTwProperty = attributes.filter(
    p => p.node && p.node.name && p.node.name.name === 'data-tw'
  )
  dataTwProperty.forEach(path => path.remove())

  // Add the attribute
  path.insertAfter(
    t.jsxAttribute(t.jsxIdentifier('data-tw'), t.stringLiteral(rawClasses))
  )
}

/* eslint-disable-next-line unicorn/prevent-abbreviations */
const addDataTwPropToExistingPath = ({
  t,
  attributes,
  rawClasses,
  path,
  state,
}) => {
  if (state.isProd || !state.configTwin.dataTwProp) return

  // Append to the existing debug attribute
  const dataTwProperty = attributes.find(
    // TODO: Use @babel/plugin-proposal-optional-chaining
    p => p.node && p.node.name && p.node.name.name === 'data-tw'
  )
  if (dataTwProperty) {
    try {
      // Existing data-tw
      if (dataTwProperty.node.value.value) {
        dataTwProperty.node.value.value = `${dataTwProperty.node.value.value} | ${rawClasses}`
        return
      }

      // New data-tw
      dataTwProperty.node.value.expression.value = `${dataTwProperty.node.value.expression.value} | ${rawClasses}`
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

export { addDataTwPropToPath, addDataTwPropToExistingPath }
