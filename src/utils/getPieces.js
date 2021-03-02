import { splitVariants } from './../variants'
import { splitImportant } from './../important'
import { splitNegative } from './../negative'
import { splitPrefix } from './../prefix'

const splitters = [splitVariants, splitPrefix, splitNegative, splitImportant]

export default context => {
  const results = splitters.reduce(
    (results, splitter) => ({ ...results, ...splitter(results) }),
    context
  )
  delete results.state
  return results
}
