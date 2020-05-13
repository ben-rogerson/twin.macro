import { splitVariants } from './../variants'
import { splitImportant } from './../important'
import { splitNegative } from './../negative'

const splitters = [splitVariants, splitNegative, splitImportant]

export default context => {
  const results = splitters.reduce(
    (results, splitter) => ({ ...results, ...splitter(results) }),
    context
  )
  delete results.state
  return results
}
