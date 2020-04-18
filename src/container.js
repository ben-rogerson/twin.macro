const getContainerStyles = ({ isCentered, screens, padding }) => {
  const baseStyle = { width: '100%' }

  const mediaScreens = screens.reduce(
    (accumulator, screen) => ({
      ...accumulator,
      [`@media (min-width: ${screen})`]: {
        maxWidth: screen,
      },
    }),
    {}
  )

  const paddingStyles = padding
    ? { paddingLeft: padding, paddingRight: padding }
    : {}

  const containerStyles = { ...baseStyle, ...mediaScreens }

  if (isCentered) {
    return {
      marginLeft: 'auto',
      marginRight: 'auto',
      ...paddingStyles,
      ...containerStyles,
    }
  }

  return { ...paddingStyles, ...containerStyles }
}

export { getContainerStyles }
