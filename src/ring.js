import timSort from 'timsort'

const ringCompare = (a, b) => {
  // The order of ring properties matter when combined into a single object
  // So here we move ring-opacity-xxx to the end to avoid being trumped
  // https://github.com/ben-rogerson/twin.macro/issues/374
  const A = /(^|:)ring-opacity-/.test(a) ? 0 : -1
  const B = /(^|:)ring-opacity-/.test(b) ? 0 : -1
  return A - B
}

const orderRingProperty = className => {
  const classNames = className.match(/\S+/g) || []
  // Tim Sort provides accurate sorting in node < 11
  // https://github.com/ben-rogerson/twin.macro/issues/20
  timSort.sort(classNames, ringCompare)
  return classNames.join(' ')
}

export { orderRingProperty }
