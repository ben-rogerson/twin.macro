const addContentClass = (classes, state) => {
  const classList = []
  const newContentValue = state.isEmotion ? '""' : 'var(--tw-content)'

  for (const classSet of classes) {
    const shouldAddContent = /(?!.*:content($|\[))(before:|after:)/.test(
      classSet
    )
    if (!shouldAddContent) {
      classList.push(classSet)
      continue
    }

    const variants = classSet.split(':').slice(0, -1).join(':')
    const classCheck = `${variants}:content`

    // Avoid adding content if it's already in the new class list
    if (!classList.some(c => c.startsWith(classCheck)))
      // Temp fix until emotion supports css variables with the content property
      classList.push(`${variants}:[content:${newContentValue}]`)

    classList.push(classSet)
  }

  return classList
}

export { addContentClass }
