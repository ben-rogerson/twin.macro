const gridCompare = attr => {
  // The order of the css properties in a grid matter when combined into one class
  // https://github.com/ben-rogerson/twin.macro/issues/363
  // We send them all to the end and move col-span-x
  // to the beginning of col-start-x and col-end-x
  if (attr.includes('col-span-')) return 1
  if (attr.includes('col-start-')) return 2
  if (attr.includes('col-end-')) return 2
  return 0
}

const orderGridProperty = className => {
  return className.sort((a, b) => gridCompare(a) - gridCompare(b))
}

export { orderGridProperty }
