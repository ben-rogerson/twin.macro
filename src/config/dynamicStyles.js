export default {
  /**
   * ===========================================
   * Layout
   */

  // https://tailwindcss.com/docs/animation
  animate: { prop: 'animation', plugin: 'animation' },

  // https://tailwindcss.com/docs/container
  container: { hasArbitrary: false, plugin: 'container' },

  // https://tailwindcss.com/docs/columns
  columns: { prop: 'columns', config: 'columns' },

  // https://tailwindcss.com/docs/just-in-time-mode#content-utilities
  content: {
    config: 'content',
    value: ({ value, isEmotion }) => {
      // Temp fix until emotion supports css variables with the content property
      if (isEmotion) return { content: value }
      return { '--tw-content': value, content: 'var(--tw-content)' }
    },
  },

  // https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
  caret: {
    plugin: 'caretColor',
    value: ['color', 'any'],
    coerced: {
      color: { property: 'caretColor' },
      any: { property: 'caretColor' },
    },
  },

  // https://tailwindcss.com/docs/box-sizing
  // https://tailwindcss.com/docs/display
  // https://tailwindcss.com/docs/float
  // https://tailwindcss.com/docs/clear
  // https://tailwindcss.com/docs/object-fit
  // See staticStyles.js

  // https://tailwindcss.com/docs/object-position
  object: { prop: 'objectPosition', config: 'objectPosition' },

  // https://tailwindcss.com/docs/overflow
  // https://tailwindcss.com/docs/position
  // See staticStyles.js

  // https://tailwindcss.com/docs/top-right-bottom-left
  top: { prop: 'top', config: 'inset' },
  bottom: { prop: 'bottom', config: 'inset' },
  right: { prop: 'right', config: 'inset' },
  left: { prop: 'left', config: 'inset' },
  'inset-y': { prop: ['top', 'bottom'], config: 'inset' },
  'inset-x': { prop: ['left', 'right'], config: 'inset' },
  inset: { prop: ['top', 'right', 'bottom', 'left'], config: 'inset' },

  // https://tailwindcss.com/docs/visibility

  // See staticStyles.js

  // https://tailwindcss.com/docs/z-index
  z: { prop: 'zIndex', config: 'zIndex' },

  // https://tailwindcss.com/docs/space
  // space-x-reverse + space-y-reverse are in staticStyles
  'space-y': {
    plugin: 'space',
    value: ({ value }) => ({
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-space-y-reverse': '0',
        marginTop: `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
        marginBottom: `calc(${value} * var(--tw-space-y-reverse))`,
      },
    }),
  },
  'space-x': {
    plugin: 'space',
    value: ({ value }) => ({
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-space-x-reverse': '0',
        marginRight: `calc(${value} * var(--tw-space-x-reverse))`,
        marginLeft: `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
      },
    }),
  },

  // https://tailwindcss.com/docs/divide-width/
  'divide-opacity': { prop: '--tw-divide-opacity', plugin: 'divide' },
  'divide-y': {
    plugin: 'divide',
    value: ['line-width', 'length'],
    coerced: {
      'line-width': value => ({
        '> :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-y-reverse': '0',
          borderTopWidth: `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
          borderBottomWidth: `calc(${value} * var(--tw-divide-y-reverse))`,
        },
      }),
      length: value => ({
        '> :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-y-reverse': '0',
          borderTopWidth: `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
          borderBottomWidth: `calc(${value} * var(--tw-divide-y-reverse))`,
        },
      }),
    },
  },
  'divide-x': {
    plugin: 'divide',
    value: ['line-width', 'length'],
    coerced: {
      'line-width': value => ({
        '> :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '0',
          borderRightWidth: `calc(${value} * var(--tw-divide-x-reverse))`,
          borderLeftWidth: `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
        },
      }),
      length: value => ({
        '> :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '0',
          borderRightWidth: `calc(${value} * var(--tw-divide-x-reverse))`,
          borderLeftWidth: `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
        },
      }),
    },
  },
  divide: {
    plugin: 'divide',
    value: ['color'],
    coerced: {
      color: {
        property: 'borderColor',
        config: 'divideColor',
        variable: '--tw-divide-opacity',
        wrapWith: '> :not([hidden]) ~ :not([hidden])',
      },
    },
  },

  /**
   * ===========================================
   * Flexbox
   */

  // https://tailwindcss.com/docs/flex-basis
  basis: { prop: 'flexBasis', config: 'flexBasis' },

  // https://tailwindcss.com/docs/flex-direction
  // https://tailwindcss.com/docs/flex-wrap
  // https://tailwindcss.com/docs/flex
  flex: { prop: 'flex', config: 'flex' },

  // https://tailwindcss.com/docs/flex-grow
  'flex-grow': { prop: 'flexGrow', config: 'flexGrow' },
  grow: { prop: 'flexGrow', config: 'flexGrow' },

  // https://tailwindcss.com/docs/flex-shrink
  shrink: { prop: 'flexShrink', config: 'flexShrink' },
  'flex-shrink': { prop: 'flexShrink', config: 'flexShrink' },

  // https://tailwindcss.com/docs/order
  order: { prop: 'order', config: 'order' },

  /**
   * ===========================================
   * Grid
   */

  // https://tailwindcss.com/docs/grid-template-columns
  'grid-cols': {
    prop: 'gridTemplateColumns',
    config: 'gridTemplateColumns',
  },

  // https://tailwindcss.com/docs/grid-column
  col: { prop: 'gridColumn', config: 'gridColumn' },
  'col-start': { prop: 'gridColumnStart', config: 'gridColumnStart' },
  'col-end': { prop: 'gridColumnEnd', config: 'gridColumnEnd' },

  // https://tailwindcss.com/docs/grid-template-rows
  'grid-rows': { prop: 'gridTemplateRows', config: 'gridTemplateRows' },

  // https://tailwindcss.com/docs/grid-row
  // TODO

  // https://tailwindcss.com/docs/grid-row
  row: { prop: 'gridRow', config: 'gridRow' },
  'row-start': { prop: 'gridRowStart', config: 'gridRowStart' },
  'row-end': { prop: 'gridRowEnd', config: 'gridRowEnd' },

  // https://tailwindcss.com/docs/grid-auto-columns
  'auto-cols': { prop: 'gridAutoColumns', config: 'gridAutoColumns' },

  // https://tailwindcss.com/docs/grid-auto-rows
  'auto-rows': { prop: 'gridAutoRows', config: 'gridAutoRows' },

  // https://tailwindcss.com/docs/gap
  gap: { prop: 'gap', config: 'gap' },
  'gap-x': { prop: 'columnGap', config: 'gap', configFallback: 'spacing' },
  'gap-y': { prop: 'rowGap', config: 'gap', configFallback: 'spacing' },

  // https://tailwindcss.com/docs/align-items
  // https://tailwindcss.com/docs/align-content
  // https://tailwindcss.com/docs/align-self
  // https://tailwindcss.com/docs/justify-content
  // See staticStyles.js

  // Deprecated since tailwindcss v1.7.0
  'col-gap': { hasArbitrary: false, prop: 'columnGap', config: 'gap' },
  'row-gap': { hasArbitrary: false, prop: 'rowGap', config: 'gap' },

  /**
   * ===========================================
   * Spacing
   */

  // https://tailwindcss.com/docs/padding
  pt: { prop: 'paddingTop', config: 'padding' },
  pr: { prop: 'paddingRight', config: 'padding' },
  pb: { prop: 'paddingBottom', config: 'padding' },
  pl: { prop: 'paddingLeft', config: 'padding' },
  px: { prop: ['paddingLeft', 'paddingRight'], config: 'padding' },
  py: { prop: ['paddingTop', 'paddingBottom'], config: 'padding' },
  p: { prop: 'padding', config: 'padding' },

  // https://tailwindcss.com/docs/margin
  mt: { prop: 'marginTop', config: 'margin' },
  mr: { prop: 'marginRight', config: 'margin' },
  mb: { prop: 'marginBottom', config: 'margin' },
  ml: { prop: 'marginLeft', config: 'margin' },
  mx: { prop: ['marginLeft', 'marginRight'], config: 'margin' },
  my: { prop: ['marginTop', 'marginBottom'], config: 'margin' },
  m: { prop: 'margin', config: 'margin' },

  /**
   * ===========================================
   * Sizing
   */

  // https://tailwindcss.com/docs/width
  w: { prop: 'width', config: 'width' },

  // https://tailwindcss.com/docs/min-width
  'min-w': { prop: 'minWidth', config: 'minWidth' },

  // https://tailwindcss.com/docs/max-width
  'max-w': { prop: 'maxWidth', config: 'maxWidth' },

  // https://tailwindcss.com/docs/height
  h: { prop: 'height', config: 'height' },

  // https://tailwindcss.com/docs/min-height
  'min-h': { prop: 'minHeight', config: 'minHeight' },

  // https://tailwindcss.com/docs/max-height
  'max-h': { prop: 'maxHeight', config: 'maxHeight' },

  /**
   * ===========================================
   * Typography
   */

  font: [
    // https://tailwindcss.com/docs/font-family
    {
      config: 'fontFamily',
      value: ['generic-name', 'family-name'],
      prop: 'fontFamily',
      coerced: {
        'generic-name': { property: 'fontFamily' },
        'family-name': { property: 'fontFamily' },
      },
    },
    // https://tailwindcss.com/docs/font-weight
    {
      config: 'fontWeight',
      value: ['number'],
      prop: 'fontWeight',
      coerced: {
        number: { property: 'fontWeight' },
      },
    },
  ],

  // https://tailwindcss.com/docs/font-smoothing
  // https://tailwindcss.com/docs/font-style
  // See staticStyles.js

  // https://tailwindcss.com/docs/letter-spacing
  tracking: { prop: 'letterSpacing', config: 'letterSpacing' },

  // https://tailwindcss.com/docs/line-height
  leading: { prop: 'lineHeight', config: 'lineHeight' },

  // https://tailwindcss.com/docs/list-style-type
  list: {
    prop: 'listStyleType',
    config: 'listStyleType',
  },

  // https://tailwindcss.com/docs/list-style-position
  // See staticStyles.js

  // https://tailwindcss.com/docs/placeholder-opacity
  'placeholder-opacity': {
    plugin: 'placeholder',
    value: ({ value }) => ({
      '::placeholder': { '--tw-placeholder-opacity': value },
    }),
  },
  // https://tailwindcss.com/docs/placeholder-color
  placeholder: {
    plugin: 'placeholder',
    value: ['color', 'any'],
    coerced: {
      color: {
        property: 'color',
        variable: '--tw-placeholder-opacity',
        wrapWith: '::placeholder',
        config: 'placeholderColor',
      },
      any: {
        property: 'color',
        wrapWith: '::placeholder',
        config: 'placeholderColor',
      },
    },
  },

  // https://tailwindcss.com/docs/text-align
  // See staticStyles.js

  // https://tailwindcss.com/docs/text-color
  // https://tailwindcss.com/docs/font-size
  'text-opacity': {
    prop: '--tw-text-opacity',
    config: 'textOpacity',
    configFallback: 'opacity',
  },
  text: {
    value: ['color', 'absolute-size', 'relative-size', 'length', 'percentage'],
    plugin: 'text',
    coerced: {
      color: {
        property: 'color',
        variable: '--tw-text-opacity',
        config: 'textColor',
      },
      'absolute-size': { property: 'fontSize' },
      'relative-size': { property: 'fontSize' },
      length: { property: 'fontSize' },
      percentage: { property: 'fontSize' },
    },
  },
  // https://tailwindcss.com/docs/text-decoration
  // See staticStyles.js

  // https://tailwindcss.com/docs/text-decoration-color
  // https://tailwindcss.com/docs/text-decoration-thickness
  decoration: {
    value: ['color', 'length', 'percentage', 'any'],
    prop: 'textDecorationColor',
    plugin: 'decoration',
    coerced: {
      color: { property: 'textDecorationColor' },
      length: { property: 'textDecorationThickness' },
      percentage: { property: 'textDecorationThickness' },
      any: { property: 'textDecorationThickness' },
    },
  },

  // https://tailwindcss.com/docs/text-underline-offset
  'underline-offset': {
    value: ['length', 'percentage'],
    prop: 'textUnderlineOffset',
    config: 'textUnderlineOffset',
    coerced: {
      length: { property: 'textUnderlineOffset' },
      percentage: { property: 'textUnderlineOffset' },
    },
  },

  // https://tailwindcss.com/docs/text-decoration-style
  // https://tailwindcss.com/docs/text-transform
  // https://tailwindcss.com/docs/text-overflow
  // See staticStyles.js

  // https://tailwindcss.com/docs/text-indent
  indent: {
    prop: 'textIndent',
    config: 'textIndent',
    configFallback: 'spacing',
    value: ['length', 'position'],
    coerced: {
      length: { property: 'textIndent' },
      position: { property: 'textIndent' },
      lookup: { property: 'textIndent' },
    },
  },

  // https://tailwindcss.com/docs/vertical-align
  // https://tailwindcss.com/docs/whitespace
  // https://tailwindcss.com/docs/word-break
  // See staticStyles.js

  /**
   * ===========================================
   * Backgrounds
   */

  // https://tailwindcss.com/docs/background-attachment
  // See staticStyles.js

  // https://tailwindcss.com/docs/background-repeat
  // See staticStyles.js

  // https://tailwindcss.com/docs/background-opacity
  'bg-opacity': {
    prop: '--tw-bg-opacity',
    config: 'backgroundOpacity',
    configFallback: 'opacity',
  },
  // https://tailwindcss.com/docs/gradient-color-stops
  bg: {
    value: ['color', 'url', 'image', 'position', 'length', 'percentage'],
    plugin: 'bg',
    coerced: {
      color: { property: 'backgroundColor', variable: '--tw-bg-opacity' },
      url: { property: 'backgroundImage' },
      image: { property: 'backgroundImage' },
      position: { property: 'backgroundPosition' },
      length: { property: 'backgroundSize' },
      percentage: { property: 'backgroundPosition' },
    },
  },

  // https://tailwindcss.com/docs/gradient-color-stops
  from: {
    plugin: 'gradient',
    value: ['color'],
    coerced: {
      color: {
        output: (value, { withAlpha }) => ({
          '--tw-gradient-from': withAlpha(value) || value,
          '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${
            withAlpha(value, '0', 'rgb(255 255 255 / 0)') || value
          })`,
        }),
      },
    },
  },
  via: {
    plugin: 'gradient',
    value: ['color'],
    coerced: {
      color: {
        output: (value, { withAlpha }) => ({
          '--tw-gradient-stops': `var(--tw-gradient-from), ${
            withAlpha(value) || value
          }, var(--tw-gradient-to, ${withAlpha(
            value,
            '0',
            'rgb(255 255 255 / 0)'
          )})`,
        }),
      },
    },
  },
  to: {
    value: ['color'],
    plugin: 'gradient',
    coerced: {
      color: {
        output: (value, { withAlpha }) => ({
          '--tw-gradient-to': `${withAlpha(value) || value}`,
        }),
      },
    },
  },

  /**
   * ===========================================
   * Borders
   */

  // https://tailwindcss.com/docs/border-style
  // See staticStyles.js

  // https://tailwindcss.com/docs/border-width
  'border-t': {
    value: ['color', 'line-width', 'length'],
    plugin: 'border',
    coerced: {
      color: {
        property: 'borderTopColor',
        variable: '--tw-border-opacity',
        config: 'borderColor',
      },
      'line-width': { property: 'borderTopWidth', config: 'borderWidth' },
      length: { property: 'borderTopWidth', config: 'borderWidth' },
    },
  },
  'border-b': {
    value: ['color', 'line-width', 'length'],
    plugin: 'border',
    coerced: {
      color: {
        property: 'borderBottomColor',
        variable: '--tw-border-opacity',
        config: 'borderColor',
      },
      'line-width': { property: 'borderBottomWidth', config: 'borderWidth' },
      length: { property: 'borderBottomWidth', config: 'borderWidth' },
    },
  },
  'border-l': {
    value: ['color', 'line-width', 'length'],
    plugin: 'border',
    coerced: {
      color: {
        property: 'borderLeftColor',
        variable: '--tw-border-opacity',
        config: 'borderColor',
      },
      'line-width': { property: 'borderLeftWidth', config: 'borderWidth' },
      length: { property: 'borderLeftWidth', config: 'borderWidth' },
    },
  },
  'border-r': {
    value: ['color', 'line-width', 'length'],
    plugin: 'border',
    coerced: {
      color: {
        property: 'borderRightColor',
        variable: '--tw-border-opacity',
        config: 'borderColor',
      },
      'line-width': { property: 'borderRightWidth', config: 'borderWidth' },
      length: { property: 'borderRightWidth', config: 'borderWidth' },
    },
  },
  'border-x': {
    value: ['color', 'line-width', 'length'],
    plugin: 'border',
    prop: '--tw-border-opacity',
    coerced: {
      color: {
        property: ['borderLeftColor', 'borderRightColor'],
        variable: '--tw-border-opacity',
        config: 'borderColor',
      },
      'line-width': {
        property: ['borderLeftWidth', 'borderRightWidth'],
        config: 'borderWidth',
      },
      length: {
        property: ['borderLeftWidth', 'borderRightWidth'],
        config: 'borderWidth',
      },
    },
  },
  'border-y': {
    value: ['color', 'line-width', 'length'],
    plugin: 'border',
    coerced: {
      color: {
        property: ['borderTopColor', 'borderBottomColor'],
        variable: '--tw-border-opacity',
        config: 'borderColor',
      },
      'line-width': {
        property: ['borderTopColor', 'borderBottomColor'],
        config: 'borderWidth',
      },
      length: {
        property: ['borderTopColor', 'borderBottomColor'],
        config: 'borderWidth',
      },
    },
  },
  'border-opacity': {
    prop: '--tw-border-opacity',
    config: 'borderOpacity',
    configFallback: 'opacity',
  },
  border: {
    value: ['color', 'line-width', 'length'],
    plugin: 'border',
    coerced: {
      color: { property: 'borderColor', variable: '--tw-border-opacity' },
      'line-width': { property: 'borderWidth' },
      length: { property: 'borderWidth' },
    },
  },

  // https://tailwindcss.com/docs/border-radius
  'rounded-tl': { prop: 'borderTopLeftRadius', config: 'borderRadius' },
  'rounded-tr': { prop: 'borderTopRightRadius', config: 'borderRadius' },
  'rounded-br': { prop: 'borderBottomRightRadius', config: 'borderRadius' },
  'rounded-bl': { prop: 'borderBottomLeftRadius', config: 'borderRadius' },
  'rounded-t': {
    prop: ['borderTopLeftRadius', 'borderTopRightRadius'],
    config: 'borderRadius',
  },
  'rounded-r': {
    prop: ['borderTopRightRadius', 'borderBottomRightRadius'],
    config: 'borderRadius',
  },
  'rounded-b': {
    prop: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    config: 'borderRadius',
  },
  'rounded-l': {
    prop: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
    config: 'borderRadius',
  },
  rounded: { prop: 'borderRadius', config: 'borderRadius' },

  // https://tailwindcss.com/docs/ring-opacity
  'ring-opacity': {
    prop: '--tw-ring-opacity',
    config: 'ringOpacity',
    configFallback: 'opacity',
  },

  // https://tailwindcss.com/docs/ring-offset-width
  // https://tailwindcss.com/docs/ring-offset-color
  'ring-offset': {
    prop: '--tw-ring-offset-width',
    value: ['length', 'color'],
    plugin: 'ringOffset',
    coerced: {
      color: { property: '--tw-ring-offset-color', config: 'ringOffsetColor' },
      length: { property: '--tw-ring-offset-width' },
    },
  },

  // https://tailwindcss.com/docs/ring-width
  // https://tailwindcss.com/docs/ring-color
  ring: {
    plugin: 'ring',
    value: ['color', 'length'],
    coerced: {
      color: {
        property: '--tw-ring-color',
        variable: '--tw-ring-opacity',
        config: 'ringColor',
      },
      length: value => ({
        '--tw-ring-offset-shadow':
          'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
        '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
        boxShadow: [
          `var(--tw-ring-offset-shadow)`,
          `var(--tw-ring-shadow)`,
          `var(--tw-shadow, 0 0 #0000)`,
        ].join(', '),
      }),
    },
  },

  /**
   * ===========================================
   * Tables
   */

  // https://tailwindcss.com/docs/border-collapse
  // https://tailwindcss.com/docs/table-layout
  // See staticStyles.js

  /**
   * ===========================================
   * Effects
   */

  // https://tailwindcss.com/docs/box-shadow
  shadow: {
    plugin: properties => {
      const coercedColor = properties.getCoerced('color')
      if (coercedColor) return coercedColor

      const coercedShadow = properties.getCoerced('shadow')
      if (coercedShadow) return coercedShadow

      return properties.errors.errorSuggestions({
        config: ['boxShadow', 'boxShadowColor'],
      })
    },
    value: ['shadow', 'color'],
    coerced: {
      color: {
        output: (value, { withAlpha }) => ({
          '--tw-shadow-color': withAlpha(value) || value,
          '--tw-shadow': 'var(--tw-shadow-colored)',
        }),
        config: 'boxShadowColor',
      },
      shadow: { config: 'boxShadow' },
    },
  },

  // https://tailwindcss.com/docs/opacity
  opacity: { prop: 'opacity', config: 'opacity' },

  /**
   * ===========================================
   * Filters
   */

  // https://tailwindcss.com/docs/filter
  // See staticStyles.js

  // https://tailwindcss.com/docs/blur
  blur: {
    value: ({ value }) => ({
      '--tw-blur': `blur(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'blur',
  },

  // https://tailwindcss.com/docs/brightness
  brightness: {
    value: ({ value }) => ({
      '--tw-brightness': `brightness(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'brightness',
  },

  // https://tailwindcss.com/docs/contrast
  contrast: {
    value: ({ value }) => ({
      '--tw-contrast': `contrast(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'contrast',
  },

  // https://tailwindcss.com/docs/drop-shadow
  'drop-shadow': {
    value: ({ value }) => ({
      '--tw-drop-shadow': `drop-shadow(${value})`,
      filter:
        'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
    }),
    plugin: 'dropShadow',
  },

  // https://tailwindcss.com/docs/grayscale
  grayscale: {
    value: ({ value }) => ({
      '--tw-grayscale': `grayscale(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'grayscale',
  },

  // https://tailwindcss.com/docs/hue-rotate
  'hue-rotate': {
    value: ({ value }) => ({
      '--tw-hue-rotate': `hue-rotate(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'hueRotate',
  },

  // https://tailwindcss.com/docs/invert
  invert: {
    value: ({ value }) => ({
      '--tw-invert': `invert(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'invert',
  },

  // https://tailwindcss.com/docs/saturate
  saturate: {
    value: ({ value }) => ({
      '--tw-saturate': `saturate(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'saturate',
  },

  // https://tailwindcss.com/docs/sepia
  sepia: {
    value: ({ value }) => ({
      '--tw-sepia': `sepia(${value})`,
      filter: 'var(--tw-filter)',
    }),
    plugin: 'sepia',
  },

  // https://tailwindcss.com/docs/backdrop-filter

  // https://tailwindcss.com/docs/backdrop-blur
  'backdrop-blur': {
    value: ({ value }) => ({
      '--tw-backdrop-blur': `blur(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropBlur',
  },

  // https://tailwindcss.com/docs/backdrop-brightness
  'backdrop-brightness': {
    value: ({ value }) => ({
      '--tw-backdrop-brightness': `brightness(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropBrightness',
  },

  // https://tailwindcss.com/docs/backdrop-contrast
  'backdrop-contrast': {
    value: ({ value }) => ({
      '--tw-backdrop-contrast': `contrast(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropContrast',
  },

  // https://tailwindcss.com/docs/backdrop-grayscale
  'backdrop-grayscale': {
    value: ({ value }) => ({
      '--tw-backdrop-grayscale': `grayscale(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropGrayscale',
  },

  // https://tailwindcss.com/docs/backdrop-hue-rotate
  'backdrop-hue-rotate': {
    value: ({ value }) => ({
      '--tw-backdrop-hue-rotate': `hue-rotate(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropHueRotate',
  },

  // https://tailwindcss.com/docs/backdrop-invert
  'backdrop-invert': {
    value: ({ value }) => ({
      '--tw-backdrop-invert': `invert(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropInvert',
  },

  // https://tailwindcss.com/docs/backdrop-opacity
  'backdrop-opacity': {
    value: ({ value }) => ({
      '--tw-backdrop-opacity': `opacity(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropOpacity',
  },

  // https://tailwindcss.com/docs/backdrop-saturate
  'backdrop-saturate': {
    value: ({ value }) => ({
      '--tw-backdrop-saturate': `saturate(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropSaturate',
  },

  // https://tailwindcss.com/docs/backdrop-sepia
  'backdrop-sepia': {
    value: ({ value }) => ({
      '--tw-backdrop-sepia': `sepia(${value})`,
      backdropFilter: 'var(--tw-backdrop-filter)',
    }),
    plugin: 'backdropSepia',
  },

  /**
   * ===========================================
   * Transitions
   */

  // https://tailwindcss.com/docs/transtiion-property
  // Note: Tailwind doesn't allow an arbitrary value but it's likely just an accident so it's been added here
  transition: {
    plugin: 'transition',
    value: ['lookup'],
    coerced: {
      lookup: (value, theme) => ({
        transitionProperty: value,
        transitionTimingFunction: theme('transitionTimingFunction.DEFAULT'),
        transitionDuration: theme('transitionDuration.DEFAULT'),
      }),
    },
  },

  // https://tailwindcss.com/docs/transition-duration
  duration: { prop: 'transitionDuration', config: 'transitionDuration' },

  // https://tailwindcss.com/docs/transition-timing-function
  ease: {
    prop: 'transitionTimingFunction',
    config: 'transitionTimingFunction',
  },

  // https://tailwindcss.com/docs/transition-delay
  delay: { prop: 'transitionDelay', config: 'transitionDelay' },

  /**
   * ===========================================
   * Transforms
   */

  // https://tailwindcss.com/docs/scale
  'scale-x': {
    value: ({ value, negative }) => ({
      '--tw-scale-x': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'scale',
  },
  'scale-y': {
    value: ({ value, negative }) => ({
      '--tw-scale-y': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'scale',
  },
  scale: {
    value: ({ value, negative }) => ({
      '--tw-scale-x': `${negative}${value}`,
      '--tw-scale-y': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'scale',
  },

  // https://tailwindcss.com/docs/rotate
  rotate: {
    value: ({ value, negative }) => ({
      '--tw-rotate': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'rotate',
  },

  // https://tailwindcss.com/docs/translate
  'translate-x': {
    value: ({ value, negative }) => ({
      '--tw-translate-x': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'translate',
  },
  'translate-y': {
    value: ({ value, negative }) => ({
      '--tw-translate-y': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'translate',
  },

  // https://tailwindcss.com/docs/skew
  'skew-x': {
    value: ({ value, negative }) => ({
      '--tw-skew-x': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'skew',
  },
  'skew-y': {
    value: ({ value, negative }) => ({
      '--tw-skew-y': `${negative}${value}`,
      transform: 'var(--tw-transform)',
    }),
    config: 'skew',
  },

  // https://tailwindcss.com/docs/transform-origin
  origin: { prop: 'transformOrigin', config: 'transformOrigin' },

  /**
   * ===========================================
   * Interactivity
   */

  // https://tailwindcss.com/docs/accent-color
  accent: {
    plugin: properties => {
      const coercedColor = properties.getCoerced('color')
      if (coercedColor) return coercedColor

      return properties.errors.errorSuggestions({ config: 'accentColor' })
    },
    prop: 'accentColor',
    value: ['color', 'any'],
    coerced: {
      color: { property: 'accentColor' },
      any: { property: 'accentColor' },
    },
  },

  // https://tailwindcss.com/docs/appearance
  // See staticStyles.js

  // https://tailwindcss.com/docs/cursor
  cursor: { prop: 'cursor', config: 'cursor' },

  // https://tailwindcss.com/docs/outline
  outline: {
    prop: 'outlineColor',
    values: ['length', 'number', 'color', 'percentage'],
    coerced: {
      length: { property: 'outlineWidth' },
      number: { property: 'outlineWidth' },
      color: { property: 'outlineColor' },
      percentage: { property: 'outlineWidth' },
    },
  },

  // https://tailwindcss.com/docs/pointer-events
  // https://tailwindcss.com/docs/resize

  // https://tailwindcss.com/docs/scroll-margin
  'scroll-m': { prop: 'scrollMargin', config: 'scrollMargin' },
  'scroll-mx': {
    prop: ['scrollMarginLeft', 'scrollMarginRight'],
    config: 'scrollMargin',
  },
  'scroll-my': {
    prop: ['scrollMarginTop', 'scrollMarginBottom'],
    config: 'scrollMargin',
  },
  'scroll-mt': { prop: 'scrollMarginTop', config: 'scrollMargin' },
  'scroll-mr': { prop: 'scrollMarginRight', config: 'scrollMargin' },
  'scroll-mb': { prop: 'scrollMarginBottom', config: 'scrollMargin' },
  'scroll-ml': { prop: 'scrollMarginLeft', config: 'scrollMargin' },

  // https://tailwindcss.com/docs/scroll-padding
  'scroll-p': { prop: 'scrollPadding', config: 'scrollPadding' },
  'scroll-px': {
    prop: ['scrollPaddingLeft', 'scrollPaddingRight'],
    config: 'scrollPadding',
  },
  'scroll-py': {
    prop: ['scrollPaddingTop', 'scrollPaddingBottom'],
    config: 'scrollPadding',
  },
  'scroll-pt': { prop: 'scrollPaddingTop', config: 'scrollPadding' },
  'scroll-pr': { prop: 'scrollPaddingRight', config: 'scrollPadding' },
  'scroll-pb': { prop: 'scrollPaddingBottom', config: 'scrollPadding' },
  'scroll-pl': { prop: 'scrollPaddingLeft', config: 'scrollPadding' },
  // https://tailwindcss.com/docs/user-select
  // See staticStyles.js

  // https://tailwindcss.com/docs/will-change
  'will-change': { prop: 'willChange', config: 'willChange' },

  /**
   * ===========================================
   * Svg
   */

  // https://tailwindcss.com/docs/fill
  fill: {
    value: ['color', 'any'],
    plugin: 'fill',
    coerced: { color: { property: 'fill' }, any: { property: 'fill' } },
  },

  // https://tailwindcss.com/docs/stroke
  stroke: {
    value: ['color', 'length', 'number', 'percentage', 'url'],
    plugin: 'stroke',
    coerced: {
      color: { property: 'stroke' },
      length: { property: 'strokeWidth' },
      number: { property: 'strokeWidth' },
      percentage: { property: 'strokeWidth' },
      url: { property: 'stroke' },
    },
  },

  /**
   * ===========================================
   * Accessibility
   */

  // https://tailwindcss.com/docs/screen-readers
  // See staticStyles.js

  /**
   * ===========================================
   * Aspect Ratio
   */
  // https://tailwindcss.com/docs/aspect-ratio
  aspect: {
    prop: 'aspectRatio',
    config: 'aspectRatio',
  },
}
