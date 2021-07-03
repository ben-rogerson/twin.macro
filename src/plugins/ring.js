import { withAlpha, toRgba } from './../utils'

function safeCall(callback, defaultValue) {
  try {
    return callback()
  } catch (_) {
    return defaultValue
  }
}

export const globalRingStyles = ({ theme }) => {
  const ringColorDefault = (([r, g, b]) =>
    `rgba(${r}, ${g}, ${b}, ${theme`ringOpacity.DEFAULT` || '0.5'})`)(
    safeCall(() => toRgba(theme`ringColor.DEFAULT`), ['147', '197', '253'])
  )

  return {
    '*': {
      '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-ring-offset-width': theme('ringOffsetWidth.DEFAULT') || '0px',
      '--tw-ring-offset-color': theme('ringOffsetColor.DEFAULT') || '#fff',
      '--tw-ring-color': ringColorDefault,
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
    },
  }
}

const handleWidth = ({ configValue, important }) => {
  const value = configValue('ringWidth')
  if (!value) return

  return {
    '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
    '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
    boxShadow: `${[
      `var(--tw-ring-offset-shadow)`,
      `var(--tw-ring-shadow)`,
      `var(--tw-shadow, 0 0 #0000)`,
    ].join(', ')}${important}`,
  }
}

const handleColor = ({ configValue, important, disableColorVariables }) => {
  const value = configValue('ringColor')
  if (!value) return

  return {
    '--tw-ring-opacity': '1',
    ...withAlpha({
      color: value,
      property: '--tw-ring-color',
      variable: !disableColorVariables && '--tw-ring-opacity',
      important,
    }),
  }
}

export default properties => {
  const {
    theme,
    match,
    getConfigValue,
    configTwin: { disableColorVariables },
    errors: { errorSuggestions },
    pieces: { important },
  } = properties

  const classValue = match(/(?<=(ring)-)([^]*)/)
  const configValue = config => getConfigValue(theme(config), classValue)

  if (classValue === 'inset') return { '--tw-ring-inset': 'inset' }

  const width = handleWidth({ configValue, important })
  if (width) return width

  const color = handleColor({ configValue, important, disableColorVariables })
  if (color) return color

  errorSuggestions({
    config: ['ringWidth', 'ringColor'],
  })
}
