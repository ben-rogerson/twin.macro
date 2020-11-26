const variantDarkMode = ({ hasGroupVariant, config, errorCustom }) => {
  const styles =
    {
      // Media strategy: The default when you prepend with dark, tw`dark:block`
      media: '@media (prefers-color-scheme: dark)',
      // Class strategy: In your tailwind.config.js, add `{ dark: 'class' }
      // then add a `className="dark"` on a parent element.
      class: !hasGroupVariant && '.dark &',
    }[config('darkMode') || 'media'] || null

  if (!styles && !hasGroupVariant) {
    errorCustom(
      "The `darkMode` config option must be either `{ darkMode: 'media' }` (default) or `{ darkMode: 'class' }`"
    )
  }

  return styles
}

const variantLightMode = ({ hasGroupVariant, config, errorCustom }) => {
  const styles =
    {
      // Media strategy: The default when you prepend with light, tw`light:block`
      media: '@media (prefers-color-scheme: light)',
      // Class strategy: In your tailwind.config.js, add `{ light: 'class' }
      // then add a `className="light"` on a parent element.
      class: !hasGroupVariant && '.light &',
    }[config('lightMode') || config('darkMode') || 'media'] || null

  if (!styles && !hasGroupVariant) {
    if (config('lightMode')) {
      errorCustom(
        "The `lightMode` config option must be either `{ lightMode: 'media' }` (default) or `{ lightMode: 'class' }`"
      )
    }

    errorCustom(
      "The `darkMode` config option must be either `{ darkMode: 'media' }` (default) or `{ darkMode: 'class' }`"
    )
  }

  return styles
}

const prefixDarkLightModeClass = (
  className,
  { hasDarkVariant, hasLightVariant, config }
) => {
  const themeVariant =
    (hasDarkVariant && config('darkMode') === 'class' && ['dark ', 'dark']) ||
    (hasLightVariant &&
      (config('lightMode') === 'class' || config('darkMode') === 'class') && [
        'light ',
        'light',
      ])
  if (!themeVariant) return className

  return themeVariant
    .map(v =>
      className
        .split(', ')
        .map(cn => `.${v}${cn}`)
        .join(', ')
    )
    .join(', ')
}

export { variantDarkMode, variantLightMode, prefixDarkLightModeClass }
