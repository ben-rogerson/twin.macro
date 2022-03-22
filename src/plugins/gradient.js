import { withAlpha } from './../utils'

export default properties => {
  const {
    pieces,
    matchConfigValue,
    pieces: { hasNegative, hasImportant, className },
    errors: { errorNoNegatives, errorNoImportant, errorSuggestions },
  } = properties

  const value = matchConfigValue(
    'gradientColorStops',
    /(?<=(from-|via-|to-))([^]*)/
  )
  const slashAlphaValue = matchConfigValue(
    'gradientColorStops',
    /(?<=(from-|via-|to-))([^]*)([^]*)(?=\/)/
  )

  const styleDefinitions =
    (value && {
      from: {
        '--tw-gradient-from': withAlpha({ pieces, color: value }) || value,
        '--tw-gradient-stops': [
          'var(--tw-gradient-from)',
          `var(--tw-gradient-to, ${withAlpha({
            color: value,
            pieces: { ...pieces, hasAlpha: true, alpha: '0' },
            fallBackColor: 'rgb(255 255 255 / 0)',
          })})`,
        ].join(', '),
      },
      via: {
        '--tw-gradient-stops': [
          'var(--tw-gradient-from)',
          withAlpha({ pieces, color: value }) || value,
          `var(--tw-gradient-to, ${withAlpha({
            color: value,
            pieces: { ...pieces, hasAlpha: true, alpha: '0' },
            fallBackColor: 'rgb(255 255 255 / 0)',
          })})`,
        ].join(', '),
      },
      to: {
        '--tw-gradient-to': withAlpha({ pieces, color: value }) || value,
      },
    }) ||
    (slashAlphaValue && {
      from: {
        ...withAlpha({
          pieces,
          color: slashAlphaValue,
          property: '--tw-gradient-from',
        }),
        '--tw-gradient-stops': [
          'var(--tw-gradient-from)',
          'var(--tw-gradient-to',
          withAlpha({
            color: slashAlphaValue,
            pieces: { ...pieces, hasAlpha: true, alpha: '0' },
          }),
        ].join(', '),
      },
      via: {
        '--tw-gradient-stops': [
          'var(--tw-gradient-from)',
          withAlpha({ color: slashAlphaValue, pieces }),
          `var(--tw-gradient-to, ${withAlpha({
            color: slashAlphaValue,
            pieces: { ...pieces, hasAlpha: true, alpha: '0' },
          })})`,
        ].join(', '),
      },
      to: withAlpha({
        color: slashAlphaValue,
        property: '--tw-gradient-to',
        pieces,
      }),
    })

  !styleDefinitions && errorSuggestions({ config: 'gradientColorStops' })

  const [, styles] =
    Object.entries(styleDefinitions).find(([k]) =>
      className.startsWith(`${k}-`)
    ) || []
  !styles && errorSuggestions({ config: 'gradientColorStops' })
  hasNegative && errorNoNegatives()
  hasImportant && errorNoImportant()

  return styles
}
