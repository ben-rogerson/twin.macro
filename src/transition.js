import timSort from 'timsort'

const transitionCompare = (a, b) => {
  // The order of transition properties matter when combined into a single object
  // So here we move transition-x to the beginning to avoid being trumped
  // https://github.com/ben-rogerson/twin.macro/issues/363
  const A = /(^|:)transition(!|$)/.test(a) ? -1 : 0
  const B = /(^|:)transition(!|$)/.test(b) ? -1 : 0
  return A - B
}

const orderTransitionProperty = className => {
  const classNames = className.match(/\S+/g) || []
  // Tim Sort provides accurate sorting in node < 11
  // https://github.com/ben-rogerson/twin.macro/issues/20
  timSort.sort(classNames, transitionCompare)
  return classNames.join(' ')
}

export { orderTransitionProperty }
