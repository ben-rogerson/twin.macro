import { splitVariants } from './variants'
import { splitImportant } from './important'
import { splitNegative } from './negative'

const splitter = className =>
  splitNegative(splitImportant(splitVariants({ className })))

export default splitter
