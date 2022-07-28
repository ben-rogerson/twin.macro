export default (list, getValue) => {
  let firstValue
  const listLength = list.length - 1
  const listItem = list.find((listItem, index) => {
    const isLast = index === listLength
    firstValue = getValue(listItem, { index, isLast })
    return Boolean(firstValue)
  })

  return [firstValue, listItem]
}
