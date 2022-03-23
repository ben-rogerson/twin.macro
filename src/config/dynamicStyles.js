export default {
  /**
   * ===========================================
   * Layout
   */

  // https://tailwindcss.com/docs/animation
  animate: { prop: 'animation', plugin: 'animation' },

  // https://tailwindcss.com/docs/container
  container: { hasArbitrary: false, plugin: 'container' },

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
    value: ['color'],
    coerced: { color: { property: 'caretColor' } },
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
    value: ['length'],
    coerced: {
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
    value: ['length'],
    coerced: {
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
        variable: '--tw-divide-opacity',
        wrapWith: '> :not([hidden]) ~ :not([hidden])',
      },
    },
  },

  /**
   * ===========================================
   * Flexbox
   */

  // https://tailwindcss.com/docs/flex-direction
  // https://tailwindcss.com/docs/flex-wrap
  // https://tailwindcss.com/docs/align-items
  // https://tailwindcss.com/docs/align-content
  // https://tailwindcss.com/docs/align-self
  // https://tailwindcss.com/docs/justify-content
  // See staticStyles.js

  // https://tailwindcss.com/docs/flex-grow
  'flex-grow': { prop: 'flexGrow', config: 'flexGrow' },

  // https://tailwindcss.com/docs/flex-shrink
  'flex-shrink': { prop: 'flexShrink', config: 'flexShrink' },

  // https://tailwindcss.com/docs/flex
  flex: { prop: 'flex', config: 'flex' },

  // https://tailwindcss.com/docs/order
  order: { prop: 'order', config: 'order' },

  /**
   * ===========================================
   * Grid
   */

  // https://tailwindcss.com/docs/grid-template-columns
  'grid-cols': { prop: 'gridTemplateColumns', config: 'gridTemplateColumns' },

  // https://tailwindcss.com/docs/grid-column
  col: { prop: 'gridColumn', config: 'gridColumn' },
  'col-start': { prop: 'gridColumnStart', config: 'gridColumnStart' },
  'col-end': { prop: 'gridColumnEnd', config: 'gridColumnEnd' },

  // https://tailwindcss.com/docs/grid-template-rows
  'grid-rows': { prop: 'gridTemplateRows', config: 'gridTemplateRows' },

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
      value: ({ value }) => ({
        fontFamily: Array.isArray(value) ? value.join(', ') : value,
      }),
    },
    // https://tailwindcss.com/docs/font-weight
    { prop: 'fontWeight', config: 'fontWeight' },
  ],

  // https://tailwindcss.com/docs/font-smoothing
  // https://tailwindcss.com/docs/font-style
  // See staticStyles.js

  // https://tailwindcss.com/docs/letter-spacing
  tracking: { prop: 'letterSpacing', config: 'letterSpacing' },

  // https://tailwindcss.com/docs/line-height
  leading: { prop: 'lineHeight', config: 'lineHeight' },

  // https://tailwindcss.com/docs/list-style-type
  list: { prop: 'listStyleType', config: 'listStyleType' },

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
    value: ['color'],
    coerced: {
      color: {
        property: 'color',
        variable: '--tw-placeholder-opacity',
        wrapWith: '::placeholder',
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
    value: ['color', 'length'],
    plugin: 'text',
    coerced: {
      color: { property: 'color', variable: '--tw-text-opacity' },
      length: { property: 'fontSize' },
    },
  },
  // https://tailwindcss.com/docs/text-decoration
  // https://tailwindcss.com/docs/text-transform
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
    value: ['color', 'url'],
    plugin: 'bg',
    coerced: {
      color: { property: 'backgroundColor', variable: '--tw-bg-opacity' },
      lookup: value => ({
        backgroundImage: value,
        backgroundSize: value,
        backgroundPosition: value,
      }),
    },
  },

  // https://tailwindcss.com/docs/gradient-color-stops
  from: {
    plugin: 'gradient',
    value: ({ value, transparentTo }) => ({
      '--tw-gradient-from': value,
      '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${transparentTo(
        value
      )})`,
    }),
  },
  via: {
    plugin: 'gradient',
    value: ({ value, transparentTo }) => ({
      '--tw-gradient-stops': `var(--tw-gradient-from), ${value}, var(--tw-gradient-to, ${transparentTo(
        value
      )})`,
    }),
  },
  to: { prop: '--tw-gradient-to', plugin: 'gradient' },

  /**
   * ===========================================
   * Borders
   */

  // https://tailwindcss.com/docs/border-style
  // See staticStyles.js

  // https://tailwindcss.com/docs/border-width
  'border-t': {
    value: ['color', 'length'],
    plugin: 'border',
    coerced: {
      length: { property: 'borderTopWidth' },
      color: { property: 'borderTopColor', variable: '--tw-border-opacity' },
    },
  },
  'border-b': {
    value: ['length', 'color'],
    plugin: 'border',
    config: ['borderWidth', 'borderColor'],
    coerced: {
      length: { property: 'borderBottomWidth' },
      color: { property: 'borderBottomColor', variable: '--tw-border-opacity' },
    },
  },
  'border-l': {
    value: ['color', 'length'],
    plugin: 'border',
    coerced: {
      length: { property: 'borderLeftWidth' },
      color: { property: 'borderLeftColor', variable: '--tw-border-opacity' },
    },
  },
  'border-r': {
    value: ['color', 'length'],
    plugin: 'border',
    coerced: {
      color: { property: 'borderRightColor', variable: '--tw-border-opacity' },
      length: { property: 'borderRightWidth' },
    },
  },
  'border-x': {
    value: ['color', 'length'],
    plugin: 'border',
    prop: '--tw-border-opacity',
    coerced: {
      color: {
        property: ['borderLeftColor', 'borderRightColor'],
        variable: '--tw-border-opacity',
      },
      length: { property: ['borderLeftWidth', 'borderRightWidth'] },
    },
  },
  'border-y': {
    value: ['color', 'length'],
    plugin: 'border',
    coerced: {
      color: {
        property: ['borderTopColor', 'borderBottomColor'],
        variable: '--tw-border-opacity',
      },
      length: { property: ['borderTopColor', 'borderBottomColor'] },
    },
  },
  'border-opacity': {
    prop: '--tw-border-opacity',
    config: 'borderOpacity',
    configFallback: 'opacity',
  },
  border: {
    value: ['color', 'length'],
    plugin: 'border',
    coerced: {
      color: { property: 'borderColor', variable: '--tw-border-opacity' },
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
      color: { property: '--tw-ring-offset-color' },
      length: { property: '--tw-ring-offset-width' },
    },
  },

  // https://tailwindcss.com/docs/ring-width
  // https://tailwindcss.com/docs/ring-color
  ring: {
    plugin: 'ring',
    value: ['color', 'length'],
    coerced: {
      color: { property: '--tw-ring-color', variable: '--tw-ring-opacity' },
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
  // Note: Tailwind doesn't allow an arbitrary value but it's likely just an accident so it's been added here
  shadow: {
    plugin: 'boxShadow',
    value: ['lookup'],
    coerced: {
      lookup: value => ({
        '--tw-shadow': value,
        boxShadow: [
          `var(--tw-ring-offset-shadow, 0 0 #0000)`,
          `var(--tw-ring-shadow, 0 0 #0000)`,
          `var(--tw-shadow)`,
        ].join(', '),
      }),
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
    plugin: 'accentColor',
    prop: 'accentColor',
    coerced: {
      color: { property: 'accentColor' },
    },
  },

  // https://tailwindcss.com/docs/appearance
  // See staticStyles.js

  // https://tailwindcss.com/docs/cursor
  cursor: { prop: 'cursor', config: 'cursor' },

  // https://tailwindcss.com/docs/outline
  outline: {
    plugin: 'outline',
    value: ({ value }) => ({ outline: value, outlineOffset: '0' }),
  },

  // https://tailwindcss.com/docs/pointer-events
  // https://tailwindcss.com/docs/resize
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
    plugin: 'fill',
    value: ['color'],
    coerced: { color: { property: 'fill' } },
  },

  // https://tailwindcss.com/docs/stroke
  stroke: {
    value: ['length', 'color'],
    plugin: 'stroke',
    coerced: {
      color: { property: 'stroke' },
      length: { property: 'strokeWidth' },
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
