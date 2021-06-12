const splitPrefix = props => {
  const { className, state } = props
  const { prefix } = state.config
  if (!prefix) return { className, hasPrefix: false }

  if (!className.startsWith(prefix)) return { className, hasPrefix: false }
  const newClassName = className.slice(prefix.length)

  return { className: newClassName, hasPrefix: true }
}

export { splitPrefix }
