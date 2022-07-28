const SPACE_ID = '_'

const formatProp = classes =>
  classes
    // Normalize spacing
    .replace(/\s\s+/g, ' ')
    // Remove newline characters
    .replace(/\n/g, ' ')
    // Replace the space id
    .replace(SPACE_ID, ' ')
    .trim()

const addDataTwPropToPath = ({
  t,
  attributes,
  rawClasses,
  path,
  state,
  propName = 'data-tw',
}) => {
  const dataTwPropAllEnvironments =
    propName === 'data-tw' && state.configTwin.dataTwProp === 'all'
  const dataCsPropAllEnvironments =
    propName === 'data-cs' && state.configTwin.dataCsProp === 'all'
  if (state.isProd && !dataTwPropAllEnvironments && !dataCsPropAllEnvironments)
    return
  if (propName === 'data-tw' && !state.configTwin.dataTwProp) return
  if (propName === 'data-cs' && !state.configTwin.dataCsProp) return

  // Remove the existing debug attribute if you happen to have it
  const dataProperty = attributes.filter(
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    p => p.node && p.node.name && p.node.name.name === propName
  )
  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  dataProperty.forEach(path => path.remove())

  const classes = formatProp(rawClasses)

  // Add the attribute
  path.insertAfter(
    t.jsxAttribute(t.jsxIdentifier(propName), t.stringLiteral(classes))
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
  const dataTwPropAllEnvironments =
    propName === 'data-tw' && state.configTwin.dataTwProp === 'all'
  const dataCsPropAllEnvironments =
    propName === 'data-cs' && state.configTwin.dataCsProp === 'all'
  if (state.isProd && !dataTwPropAllEnvironments && !dataCsPropAllEnvironments)
    return
  if (propName === 'data-tw' && !state.configTwin.dataTwProp) return
  if (propName === 'data-cs' && !state.configTwin.dataCsProp) return

  // Append to the existing debug attribute
  const dataProperty = attributes.find(
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    p => p.node && p.node.name && p.node.name.name === propName
  )
  if (dataProperty) {
    try {
      // Existing data prop
      if (dataProperty.node.value.value) {
        dataProperty.node.value.value = `${[
          dataProperty.node.value.value,
          rawClasses,
        ]
          .filter(Boolean)
          .join(' | ')}`
        return
      }

      // New data prop
      dataProperty.node.value.expression.value = `${[
        dataProperty.node.value.expression.value,
        rawClasses,
      ]
        .filter(Boolean)
        .join(' | ')}`
    } catch (_) {}

    return
  }

  const classes = formatProp(rawClasses)

  // Add a new attribute
  path.pushContainer(
    'attributes',
    t.jSXAttribute(
      t.jSXIdentifier(propName),
      t.jSXExpressionContainer(t.stringLiteral(classes))
    )
  )
}

export { addDataTwPropToPath, addDataPropToExistingPath }
