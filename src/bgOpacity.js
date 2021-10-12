import timSort from 'timsort'

const bgOpacityCompare = (a, b) => {
  // The order of bg-opacity matters when combined into a single object
  // So we move bg-opacity-xxx to the end to avoid being trumped by the bg color
  const A = /(^|:)bg-opacity-/.test(a) ? 0 : -1
  const B = /(^|:)bg-opacity-/.test(b) ? 0 : -1
  return A - B
}

const orderBgOpacityProperty = className => {
  const classNames = className.match(/\S+/g) || []
  // Tim Sort provides accurate sorting in node < 11
  // https://github.com/ben-rogerson/twin.macro/issues/20
  timSort.sort(classNames, bgOpacityCompare)
  return classNames.join(' ')
}

export { orderBgOpacityProperty }
