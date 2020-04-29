import { mergeImportant } from './important'

const transformPlaceholder = ({ style, pieces: { className } }) => {
  const isPlaceholder = className.startsWith('placeholder-')
  return isPlaceholder ? { '::placeholder': style } : style
}

const transformImportant = ({ style, pieces: { hasImportant } }) =>
  mergeImportant(style, hasImportant)

const applyTransforms = context => {
  const { style, type } = context
  if (!style) return
  let result = context.style
  if (type !== 'corePlugin') result = transformImportant(context)
  result = transformPlaceholder({ ...context, style: result })
  return result
}

export default applyTransforms
