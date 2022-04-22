const addContentClass = (classes, state) => {
  const newClasses = []
  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  classes.forEach(classSet => {
    const shouldAddContent = /(?!.*:content($|\[))(before:|after:)/.test(
      classSet
    )
    if (!shouldAddContent) return newClasses.push(classSet)

    const variants = classSet.split(':').slice(0, -1).join(':')

    // Avoid adding content if it's already in the new class list
    if (!newClasses.some(c => c.startsWith(`${variants}:content`)))
      // Temp fix until emotion supports css variables with the content property
      newClasses.push(
        `${variants}:content[${state.isEmotion ? '""' : 'var(--tw-content)'}]`
      )

    newClasses.push(classSet)
  })

  return newClasses
}

export { addContentClass }
