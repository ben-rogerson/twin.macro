import { splitVariants } from './../variants'
import { splitImportant } from './../important'
import { splitNegative } from './../negative'

export default properties =>
  splitNegative(splitImportant(splitVariants(properties)))
