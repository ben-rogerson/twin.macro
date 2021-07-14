const addContentClass = classes => {
  const newClasses = []
  classes.forEach(classSet => {
    const shouldAddContent = /(?!.*:content($|\[))(before:|after:)/.test(
      classSet
    )
    if (!shouldAddContent) return newClasses.push(classSet)

    const variants = classSet.split(':').slice(0, -1).join(':')

    // Avoid adding content if it's already in the new class list
    if (!newClasses.some(c => c.startsWith(`${variants}:content`)))
      newClasses.push(`${variants}:content`)

    newClasses.push(classSet)
  })

  return newClasses
}

export { addContentClass }
