import timSort from 'timsort'

const gridCompare = (a, b) => {
  // The order of grid properties matter when combined into a single object
  // So here we move col-span-x to the beginning to avoid being trumped
  // https://github.com/ben-rogerson/twin.macro/issues/363
  const A = /(^|:)col-span-/.test(a) ? -1 : 0
  const B = /(^|:)col-span-/.test(b) ? -1 : 0
  return A - B
}

const orderGridProperty = className => {
  const classNames = className.match(/\S+/g) || []
  // Tim Sort provides accurate sorting in node < 11
  // https://github.com/ben-rogerson/twin.macro/issues/20
  timSort.sort(classNames, gridCompare)
  return classNames.join(' ')
}

export { orderGridProperty }
