import { mergeImportant } from './important'

const transformImportant = ({ style, pieces: { hasImportant } }) =>
  mergeImportant(style, hasImportant)

const applyTransforms = context => {
  const { style, type } = context
  if (!style) return

  let result = context.style
  if (type !== 'corePlugin') result = transformImportant(context)

  return result
}

export default applyTransforms
