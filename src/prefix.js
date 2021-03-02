const splitPrefix = props => {
  const { className, state } = props
  const { prefix } = state.config
  if (!prefix) return { className, hasPrefix: false }

  if (!className.startsWith(prefix)) return { className, hasPrefix: false }

  return { className: className.slice(prefix.length), hasPrefix: true }
}

export { splitPrefix }
