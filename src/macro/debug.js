import { SPACE_ID } from './../contants'

const addDataTwPropToPath = ({
  t,
  attributes,
  rawClasses,
  path,
  state,
  propName = 'data-tw',
}) => {
  if (state.isProd) return
  if (propName === 'data-tw' && !state.configTwin.dataTwProp) return
  if (propName === 'data-cs' && !state.configTwin.dataCsProp) return

  // Remove the existing debug attribute if you happen to have it
  const dataProperty = attributes.filter(
    // TODO: Use @babel/plugin-proposal-optional-chaining
    p => p.node && p.node.name && p.node.name.name === propName
  )
  dataProperty.forEach(path => path.remove())

  // Replace the "stand-in spaces" with real ones
  const originalClasses = rawClasses.replace(new RegExp(SPACE_ID, 'g'), ' ')

  // Add the attribute
  path.insertAfter(
    t.jsxAttribute(t.jsxIdentifier(propName), t.stringLiteral(originalClasses))
  )
}

const addDataPropToExistingPath = ({
  t,
  attributes,
  rawClasses,
  path,
  state,
  propName = 'data-tw',
}) => {
  if (state.isProd) return
  if (propName === 'data-tw' && !state.configTwin.dataTwProp) return
  if (propName === 'data-cs' && !state.configTwin.dataCsProp) return

  // Append to the existing debug attribute
  const dataProperty = attributes.find(
    // TODO: Use @babel/plugin-proposal-optional-chaining
    p => p.node && p.node.name && p.node.name.name === propName
  )
  if (dataProperty) {
    try {
      // Existing data prop
      if (dataProperty.node.value.value) {
        dataProperty.node.value.value = `${dataProperty.node.value.value} | ${rawClasses}`
        return
      }

      // New data prop
      dataProperty.node.value.expression.value = `${dataProperty.node.value.expression.value} | ${rawClasses}`
    } catch (_) {}

    return
  }

  // Replace the "stand-in spaces" with realnd ones
  const originalClasses = rawClasses.replace(new RegExp(SPACE_ID, 'g'), ' ')

  // Add a new attribute
  path.pushContainer(
    'attributes',
    t.jSXAttribute(
      t.jSXIdentifier(propName),
      t.jSXExpressionContainer(t.stringLiteral(originalClasses))
    )
  )
}

export { addDataTwPropToPath, addDataPropToExistingPath }
