import { isEmpty } from './../utils'

const properties = type => ({
  left: `${type}Left`,
  right: `${type}Right`,
})

const getSpacingFromArray = ({ values, left, right }) => {
  if (!Array.isArray(values)) return
  const [valueLeft, valueRight] = values
  return { [left]: valueLeft, [right]: valueRight }
}

const getSpacingStyle = (type, values, key) => {
  if (Array.isArray(values) || typeof values !== 'object') return

  const propertyValue = values[key] || {}
  if (isEmpty(propertyValue)) return

  const objectArraySpacing = getSpacingFromArray({
    values: propertyValue,
    ...properties(type),
  })
  if (objectArraySpacing) return objectArraySpacing

  return {
    [properties(type).left]: propertyValue,
    [properties(type).right]: propertyValue,
  }
}

export default ({
  pieces: { hasVariants, hasImportant, hasNegative },
  errors: { errorNoVariants, errorNoImportant, errorNoNegatives },
  theme,
}) => {
  hasVariants && errorNoVariants()
  hasImportant && errorNoImportant()
  hasNegative && errorNoNegatives()

  const { container, screens: screensRaw } = theme()
  const { padding, margin, center } = container

  const screens = container.screens || screensRaw

  const mediaScreens = Object.entries(screens).reduce(
    (accumulator, [key, rawValue]) => {
      const value =
        typeof rawValue === 'object'
          ? rawValue.min || rawValue['min-width']
          : rawValue
      return {
        ...accumulator,
        [`@media (min-width: ${value})`]: {
          maxWidth: value,
          ...(padding && getSpacingStyle('padding', padding, key)),
          ...(!center && margin && getSpacingStyle('margin', margin, key)),
        },
      }
    },
    {}
  )

  const paddingStyles = Array.isArray(padding)
    ? getSpacingFromArray({ values: padding, ...properties('padding') })
    : typeof padding === 'object'
    ? getSpacingStyle('padding', padding, 'default')
    : { paddingLeft: padding, paddingRight: padding }

  let marginStyles = Array.isArray(margin)
    ? getSpacingFromArray({ values: margin, ...properties('margin') })
    : typeof margin === 'object'
    ? getSpacingStyle('margin', margin, 'default')
    : { marginLeft: margin, marginRight: margin }

  // { center: true } overrides any margin styles
  if (center) marginStyles = { marginLeft: 'auto', marginRight: 'auto' }

  return {
    width: '100%',
    ...paddingStyles,
    ...marginStyles,
    ...mediaScreens,
  }
}
