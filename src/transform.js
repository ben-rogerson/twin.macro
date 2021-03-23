import timSort from 'timsort'

const transformCompare = (a, b) => {
  // The order of transform properties matter when combined into a single object
  // So here we move transform to the beginning to avoid being trumped
  // https://github.com/ben-rogerson/twin.macro/issues/363
  const A = /(^|:)transform(!|$)/.test(a) ? -1 : 0
  const B = /(^|:)transform(!|$)/.test(b) ? -1 : 0
  return A - B
}

const orderTransformProperty = className => {
  const classNames = className.match(/\S+/g) || []
  // Tim Sort provides accurate sorting in node < 11
  // https://github.com/ben-rogerson/twin.macro/issues/20
  timSort.sort(classNames, transformCompare)
  return classNames.join(' ')
}

export { orderTransformProperty }
