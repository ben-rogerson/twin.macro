// https://tailwindcss.com/docs/font-variant-numeric
// This feature uses var+comment hacks to get around property stripping:
// https://github.com/tailwindlabs/tailwindcss.com/issues/522#issuecomment-687667238
const cssFontVariantNumericValue =
  'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)'

const cssTransformValue = [
  'translate(var(--tw-translate-x), var(--tw-translate-y))',
  'rotate(var(--tw-rotate))',
  'skewX(var(--tw-skew-x))',
  'skewY(var(--tw-skew-y))',
  'scaleX(var(--tw-scale-x))',
  'scaleY(var(--tw-scale-y))',
].join(' ')

const cssFilterValue = [
  'var(--tw-blur)',
  'var(--tw-brightness)',
  'var(--tw-contrast)',
  'var(--tw-grayscale)',
  'var(--tw-hue-rotate)',
  'var(--tw-invert)',
  'var(--tw-saturate)',
  'var(--tw-sepia)',
  'var(--tw-drop-shadow)',
].join(' ')

const cssBackdropFilterValue = [
  'var(--tw-backdrop-blur)',
  'var(--tw-backdrop-brightness)',
  'var(--tw-backdrop-contrast)',
  'var(--tw-backdrop-grayscale)',
  'var(--tw-backdrop-hue-rotate)',
  'var(--tw-backdrop-invert)',
  'var(--tw-backdrop-opacity)',
  'var(--tw-backdrop-saturate)',
  'var(--tw-backdrop-sepia)',
].join(' ')

const cssTouchActionValue =
  'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)'

export default {
  // https://tailwindcss.com/docs/container
  container: {
    output({ theme, pieces }) {
      const { className } = pieces
      if (className !== 'container') return

      const container = theme('container')
      const { padding, margin, center } = container

      const screens = container.screens || theme('screens')

      // eslint-disable-next-line unicorn/consistent-function-scoping
      const properties = type => ({
        left: `${type}Left`,
        right: `${type}Right`,
      })

      const getSpacingFromArray = ({ values, left, right }) => {
        if (!Array.isArray(values)) return
        const [valueLeft, valueRight] = values
        return { [left]: valueLeft, [right]: valueRight }
      }

      const getSpacingStyle = (type, values, key) => {
        if (Array.isArray(values) || typeof values !== 'object') return

        const propertyValue = values[key]
        if (!propertyValue) return

        const objectArraySpacing = getSpacingFromArray({
          values: propertyValue,
          ...properties(type),
        })
        if (objectArraySpacing) return objectArraySpacing

        return {
          [properties(type).left]: propertyValue,
          [properties(type).right]: propertyValue,
        }
      }

      const mediaScreens = Object.entries(screens).reduce(
        (accumulator, [key, rawValue]) => {
          const value =
            typeof rawValue === 'object'
              ? rawValue.min || rawValue['min-width']
              : rawValue
          return {
            ...accumulator,
            [`@media (min-width: ${value})`]: {
              maxWidth: value,
              ...(padding && getSpacingStyle('padding', padding, key)),
              ...(!center && margin && getSpacingStyle('margin', margin, key)),
            },
          }
        },
        {}
      )

      const paddingStyles = Array.isArray(padding)
        ? getSpacingFromArray({ values: padding, ...properties('padding') })
        : typeof padding === 'object'
        ? getSpacingStyle('padding', padding, 'DEFAULT')
        : { paddingLeft: padding, paddingRight: padding }

      let marginStyles = Array.isArray(margin)
        ? getSpacingFromArray({ values: margin, ...properties('margin') })
        : typeof margin === 'object'
        ? getSpacingStyle('margin', margin, 'DEFAULT')
        : { marginLeft: margin, marginRight: margin }

      // { center: true } overrides any margin styles
      if (center) marginStyles = { marginLeft: 'auto', marginRight: 'auto' }

      return {
        width: '100%',
        ...paddingStyles,
        ...marginStyles,
        ...mediaScreens,
      }
    },
    supportsImportant: false,
  },

  // https://tailwindcss.com/docs/screen-readers
  'sr-only': {
    output: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    },
    config: 'accessibility',
  },
  'not-sr-only': {
    output: {
      position: 'static',
      width: 'auto',
      height: 'auto',
      padding: '0',
      margin: '0',
      overflow: 'visible',
      clip: 'auto',
      whiteSpace: 'normal',
    },
    config: 'accessibility',
  },

  // https://tailwindcss.com/docs/pointer-events
  'pointer-events-none': { output: { pointerEvents: 'none' } },
  'pointer-events-auto': { output: { pointerEvents: 'auto' } },

  // https://tailwindcss.com/docs/visibility
  visible: { output: { visibility: 'visible' } },
  invisible: { output: { visibility: 'hidden' } },

  // https://tailwindcss.com/docs/position
  static: { output: { position: 'static' } },
  fixed: { output: { position: 'fixed' } },
  absolute: { output: { position: 'absolute' } },
  relative: { output: { position: 'relative' } },
  sticky: { output: { position: 'sticky' } },

  // https://tailwindcss.com/docs/top-right-bottom-left
  'inset-y': {
    property: ['top', 'bottom'],
    config: 'inset',
    supportsNegativeValues: true,
  },
  'inset-x': {
    property: ['left', 'right'],
    config: 'inset',
    supportsNegativeValues: true,
  },
  inset: {
    property: ['top', 'right', 'bottom', 'left'],
    config: 'inset',
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/top-right-bottom-left
  top: { property: 'top', config: 'inset', supportsNegativeValues: true },
  bottom: { property: 'bottom', config: 'inset', supportsNegativeValues: true },
  right: { property: 'right', config: 'inset', supportsNegativeValues: true },
  left: { property: 'left', config: 'inset', supportsNegativeValues: true },

  // https://tailwindcss.com/docs/isolation
  isolate: { output: { isolation: 'isolate' } },
  'isolation-auto': { output: { isolation: 'auto' } },

  // https://tailwindcss.com/docs/z-index
  z: { property: 'zIndex', config: 'zIndex', supportsNegativeValues: true },

  // https://tailwindcss.com/docs/order
  order: { property: 'order', config: 'order', supportsNegativeValues: true },

  // https://tailwindcss.com/docs/grid-column
  col: { property: 'gridColumn', config: 'gridColumn' },
  'col-start': { property: 'gridColumnStart', config: 'gridColumnStart' },
  'col-end': { property: 'gridColumnEnd', config: 'gridColumnEnd' },

  // Deprecated since tailwindcss v1.7.0
  'col-gap': { property: 'columnGap', config: 'gap' },
  'row-gap': { property: 'rowGap', config: 'gap' },

  // https://tailwindcss.com/docs/grid-row
  row: { property: 'gridRow', config: 'gridRow' },
  'row-start': { property: 'gridRowStart', config: 'gridRowStart' },
  'row-end': { property: 'gridRowEnd', config: 'gridRowEnd' },

  // https://tailwindcss.com/docs/float
  'float-right': { output: { float: 'right' } },
  'float-left': { output: { float: 'left' } },
  'float-none': { output: { float: 'none' } },

  // https://tailwindcss.com/docs/clear
  'clear-left': { output: { clear: 'left' } },
  'clear-right': { output: { clear: 'right' } },
  'clear-both': { output: { clear: 'both' } },
  'clear-none': { output: { clear: 'none' } },

  // https://tailwindcss.com/docs/margin
  mt: { property: 'marginTop', config: 'margin', supportsNegativeValues: true },
  mr: {
    property: 'marginRight',
    config: 'margin',
    supportsNegativeValues: true,
  },
  mb: {
    property: 'marginBottom',
    config: 'margin',
    supportsNegativeValues: true,
  },
  ml: {
    property: 'marginLeft',
    config: 'margin',
    supportsNegativeValues: true,
  },
  mx: {
    property: ['marginLeft', 'marginRight'],
    config: 'margin',
    supportsNegativeValues: true,
  },
  my: {
    property: ['marginTop', 'marginBottom'],
    config: 'margin',
    supportsNegativeValues: true,
  },
  m: { property: 'margin', config: 'margin', supportsNegativeValues: true },

  // https://tailwindcss.com/docs/box-sizing
  'box-border': { output: { boxSizing: 'border-box' } },
  'box-content': { output: { boxSizing: 'content-box' } },

  // https://tailwindcss.com/docs/display
  block: { output: { display: 'block' } },
  'inline-block': { output: { display: 'inline-block' } },
  inline: { output: { display: 'inline' } },
  'inline-flex': { output: { display: 'inline-flex' } },
  table: { output: { display: 'table' } },
  'inline-table': { output: { display: 'inline-table' } },
  'table-caption': { output: { display: 'table-caption' } },
  'table-cell': { output: { display: 'table-cell' } },
  'table-column': { output: { display: 'table-column' } },
  'table-column-group': { output: { display: 'table-column-group' } },
  'table-footer-group': { output: { display: 'table-footer-group' } },
  'table-header-group': { output: { display: 'table-header-group' } },
  'table-row-group': { output: { display: 'table-row-group' } },
  'table-row': { output: { display: 'table-row' } },
  'flow-root': { output: { display: 'flow-root' } },
  grid: { output: { display: 'grid' } },
  'inline-grid': { output: { display: 'inline-grid' } },
  contents: { output: { display: 'contents' } },
  'list-item': { output: { display: 'list-item' } },
  hidden: { output: { display: 'none' } },

  // https://tailwindcss.com/docs/aspect-ratio
  aspect: { property: 'aspectRatio', config: 'aspectRatio' },

  // https://tailwindcss.com/docs/height
  h: { property: 'height', config: 'height' },

  // https://tailwindcss.com/docs/max-height
  'max-h': { property: 'maxHeight', config: 'maxHeight' },

  // https://tailwindcss.com/docs/min-height
  'min-h': { property: 'minHeight', config: 'minHeight' },

  // https://tailwindcss.com/docs/width
  w: { property: 'width', config: 'width' },

  // https://tailwindcss.com/docs/min-width
  'min-w': { property: 'minWidth', config: 'minWidth' },

  // https://tailwindcss.com/docs/max-width
  'max-w': { property: 'maxWidth', config: 'maxWidth' },

  // https://tailwindcss.com/docs/flex
  flex: [{ output: { display: 'flex' } }, { property: 'flex', config: 'flex' }],

  // https://tailwindcss.com/docs/flex-shrink
  shrink: { property: 'flexShrink', config: 'flexShrink' },
  'flex-shrink': { property: 'flexShrink', config: 'flexShrink' },

  // https://tailwindcss.com/docs/flex-grow
  'flex-grow': { property: 'flexGrow', config: 'flexGrow' },
  grow: { property: 'flexGrow', config: 'flexGrow' },

  // https://tailwindcss.com/docs/flex-basis
  basis: { property: 'flexBasis', config: 'flexBasis' },

  // https://tailwindcss.com/docs/table-layout
  'table-auto': { output: { tableLayout: 'auto' } },
  'table-fixed': { output: { tableLayout: 'fixed' } },

  // https://tailwindcss.com/docs/border-collapse
  'border-collapse': { output: { borderCollapse: 'collapse' } },
  'border-separate': { output: { borderCollapse: 'separate' } },

  // TODO: Border spacing

  // https://tailwindcss.com/docs/transform-origin
  origin: { property: 'transformOrigin', config: 'transformOrigin' },

  // https://tailwindcss.com/docs/translate
  'translate-x': {
    output: ({ value }) => ({
      '--tw-translate-x': value,
      transform: cssTransformValue,
    }),
    config: 'translate',
    supportsNegativeValues: true,
  },
  'translate-y': {
    output: ({ value }) => ({
      '--tw-translate-y': value,
      transform: cssTransformValue,
    }),
    config: 'translate',
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/rotate
  rotate: {
    output: ({ value }) => ({
      '--tw-rotate': value,
      transform: cssTransformValue,
    }),
    config: 'rotate',
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/skew
  'skew-x': {
    output: ({ value }) => ({
      '--tw-skew-x': value,
      transform: cssTransformValue,
    }),
    config: 'skew',
    supportsNegativeValues: true,
  },
  'skew-y': {
    output: ({ value }) => ({
      '--tw-skew-y': value,
      transform: cssTransformValue,
    }),
    config: 'skew',
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/scale
  'scale-x': {
    output: ({ value }) => ({
      '--tw-scale-x': value,
      transform: cssTransformValue,
    }),
    config: 'scale',
    supportsNegativeValues: true,
  },
  'scale-y': {
    output: ({ value }) => ({
      '--tw-scale-y': value,
      transform: cssTransformValue,
    }),
    config: 'scale',
    supportsNegativeValues: true,
  },
  scale: {
    output: ({ value }) => ({
      '--tw-scale-x': value,
      '--tw-scale-y': value,
      transform: cssTransformValue,
    }),
    config: 'scale',
    supportsNegativeValues: true,
  },

  transform: { output: { transform: cssTransformValue } },

  'transform-cpu': { output: { transform: cssTransformValue } },

  'transform-gpu': {
    output: {
      transform: cssTransformValue.replace(
        'translate(var(--tw-translate-x), var(--tw-translate-y))',
        'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)'
      ),
    },
  },

  'transform-none': { output: { transform: 'none' } },

  // https://tailwindcss.com/docs/animation
  animate: { property: 'animation', config: 'animation' },

  // https://tailwindcss.com/docs/cursor
  cursor: { property: 'cursor', config: 'cursor' },

  // https://tailwindcss.com/docs/touch-action
  'touch-auto': { output: { touchAction: 'auto' } },
  'touch-none': { output: { touchAction: 'none' } },
  'touch-pan-x': {
    output: { '--tw-pan-x': 'pan-x', touchAction: cssTouchActionValue },
  },
  'touch-pan-left': {
    output: { '--tw-pan-x': 'pan-left', touchAction: cssTouchActionValue },
  },
  'touch-pan-right': {
    output: { '--tw-pan-x': 'pan-right', touchAction: cssTouchActionValue },
  },
  'touch-pan-y': {
    output: { '--tw-pan-y': 'pan-y', touchAction: cssTouchActionValue },
  },
  'touch-pan-up': {
    output: { '--tw-pan-y': 'pan-up', touchAction: cssTouchActionValue },
  },
  'touch-pan-down': {
    output: { '--tw-pan-y': 'pan-down', touchAction: cssTouchActionValue },
  },
  'touch-pinch-zoom': {
    output: {
      '--tw-pinch-zoom': 'pinch-zoom',
      touchAction: cssTouchActionValue,
    },
  },
  'touch-manipulation': { output: { touchAction: 'manipulation' } },

  // https://tailwindcss.com/docs/user-select
  'select-none': { output: { userSelect: 'none' } },
  'select-text': { output: { userSelect: 'text' } },
  'select-all': { output: { userSelect: 'all' } },
  'select-auto': { output: { userSelect: 'auto' } },

  // https://tailwindcss.com/docs/resize
  'resize-none': { output: { resize: 'none' } },
  'resize-y': { output: { resize: 'vertical' } },
  'resize-x': { output: { resize: 'horizontal' } },
  resize: { output: { resize: 'both' } },

  // https://tailwindcss.com/docs/scroll-snap-type
  'snap-none': { output: { scrollSnapType: 'none' } },
  'snap-x': {
    output: { scrollSnapType: 'x var(--tw-scroll-snap-strictness)' },
  },
  'snap-y': {
    output: { scrollSnapType: 'y var(--tw-scroll-snap-strictness)' },
  },
  'snap-both': {
    output: { scrollSnapType: 'both var(--tw-scroll-snap-strictness)' },
  },
  'snap-mandatory': { output: { '--tw-scroll-snap-strictness': 'mandatory' } },
  'snap-proximity': { output: { '--tw-scroll-snap-strictness': 'proximity' } },

  // https://tailwindcss.com/docs/scroll-snap-align
  'snap-start': { output: { scrollSnapAlign: 'start' } },
  'snap-end': { output: { scrollSnapAlign: 'end' } },
  'snap-center': { output: { scrollSnapAlign: 'center' } },
  'snap-align-none': { output: { scrollSnapAlign: 'none' } },

  // https://tailwindcss.com/docs/scroll-snap-stop
  'snap-normal': { output: { scrollSnapStop: 'normal' } },
  'snap-always': { output: { scrollSnapStop: 'always' } },

  // https://tailwindcss.com/docs/scroll-margin
  'scroll-m': {
    property: 'scrollMargin',
    config: 'scrollMargin',
    supportsNegativeValues: true,
  },
  'scroll-mx': {
    property: ['scrollMarginLeft', 'scrollMarginRight'],
    config: 'scrollMargin',
    supportsNegativeValues: true,
  },
  'scroll-my': {
    property: ['scrollMarginTop', 'scrollMarginBottom'],
    config: 'scrollMargin',
    supportsNegativeValues: true,
  },
  'scroll-mt': {
    property: 'scrollMarginTop',
    config: 'scrollMargin',
    supportsNegativeValues: true,
  },
  'scroll-mr': {
    property: 'scrollMarginRight',
    config: 'scrollMargin',
    supportsNegativeValues: true,
  },
  'scroll-mb': {
    property: 'scrollMarginBottom',
    config: 'scrollMargin',
    supportsNegativeValues: true,
  },
  'scroll-ml': {
    property: 'scrollMarginLeft',
    config: 'scrollMargin',
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/scroll-padding
  'scroll-p': { property: 'scrollPadding', config: 'scrollPadding' },
  'scroll-px': {
    property: ['scrollPaddingLeft', 'scrollPaddingRight'],
    config: 'scrollPadding',
  },
  'scroll-py': {
    property: ['scrollPaddingTop', 'scrollPaddingBottom'],
    config: 'scrollPadding',
  },
  'scroll-pt': { property: 'scrollPaddingTop', config: 'scrollPadding' },
  'scroll-pr': { property: 'scrollPaddingRight', config: 'scrollPadding' },
  'scroll-pb': { property: 'scrollPaddingBottom', config: 'scrollPadding' },
  'scroll-pl': { property: 'scrollPaddingLeft', config: 'scrollPadding' },

  // https://tailwindcss.com/docs/list-style-position
  'list-inside': { output: { listStylePosition: 'inside' } },
  'list-outside': { output: { listStylePosition: 'outside' } },

  // https://tailwindcss.com/docs/list-style-type
  list: { property: 'listStyleType', config: 'listStyleType' },

  // https://tailwindcss.com/docs/appearance
  'appearance-none': { output: { appearance: 'none' } },

  // https://tailwindcss.com/docs/columns
  columns: { property: 'columns', config: 'columns' },

  // https://tailwindcss.com/docs/break-before
  'break-before-auto': { output: { breakBefore: 'auto' } },
  'break-before-avoid': { output: { breakBefore: 'avoid' } },
  'break-before-all': { output: { breakBefore: 'all' } },
  'break-before-avoid-page': { output: { breakBefore: 'avoid-page' } },
  'break-before-page': { output: { breakBefore: 'page' } },
  'break-before-left': { output: { breakBefore: 'left' } },
  'break-before-right': { output: { breakBefore: 'right' } },
  'break-before-column': { output: { breakBefore: 'column' } },

  // https://tailwindcss.com/docs/break-inside
  'break-inside-auto': { output: { breakInside: 'auto' } },
  'break-inside-avoid': { output: { breakInside: 'avoid' } },
  'break-inside-avoid-page': { output: { breakInside: 'avoid-page' } },
  'break-inside-avoid-column': { output: { breakInside: 'avoid-column' } },

  // https://tailwindcss.com/docs/break-after
  'break-after-auto': { output: { breakAfter: 'auto' } },
  'break-after-avoid': { output: { breakAfter: 'avoid' } },
  'break-after-all': { output: { breakAfter: 'all' } },
  'break-after-avoid-page': { output: { breakAfter: 'avoid-page' } },
  'break-after-page': { output: { breakAfter: 'page' } },
  'break-after-left': { output: { breakAfter: 'left' } },
  'break-after-right': { output: { breakAfter: 'right' } },
  'break-after-column': { output: { breakAfter: 'column' } },

  // https://tailwindcss.com/docs/grid-auto-columns
  'auto-cols': { property: 'gridAutoColumns', config: 'gridAutoColumns' },

  // https://tailwindcss.com/docs/grid-auto-flow
  'grid-flow-row': { output: { gridAutoFlow: 'row' } },
  'grid-flow-col': { output: { gridAutoFlow: 'column' } },
  'grid-flow-row-dense': { output: { gridAutoFlow: 'row dense' } },
  'grid-flow-col-dense': { output: { gridAutoFlow: 'column dense' } },

  // https://tailwindcss.com/docs/grid-auto-rows
  'auto-rows': { property: 'gridAutoRows', config: 'gridAutoRows' },

  // https://tailwindcss.com/docs/grid-template-columns
  'grid-cols': {
    property: 'gridTemplateColumns',
    config: 'gridTemplateColumns',
  },

  // https://tailwindcss.com/docs/grid-template-rows
  'grid-rows': { property: 'gridTemplateRows', config: 'gridTemplateRows' },

  // https://tailwindcss.com/docs/flexbox-direction
  'flex-row': { output: { flexDirection: 'row' } },
  'flex-row-reverse': { output: { flexDirection: 'row-reverse' } },
  'flex-col': { output: { flexDirection: 'column' } },
  'flex-col-reverse': {
    output: { flexDirection: 'column-reverse' },
  },

  // https://tailwindcss.com/docs/flex-wrap
  'flex-wrap': { output: { flexWrap: 'wrap' } },
  'flex-wrap-reverse': { output: { flexWrap: 'wrap-reverse' } },
  'flex-nowrap': { output: { flexWrap: 'nowrap' } },

  // https://tailwindcss.com/docs/place-content
  'place-content-center': { output: { placeContent: 'center' } },
  'place-content-start': { output: { placeContent: 'start' } },
  'place-content-end': { output: { placeContent: 'end' } },
  'place-content-between': { output: { placeContent: 'space-between' } },
  'place-content-around': { output: { placeContent: 'space-around' } },
  'place-content-evenly': { output: { placeContent: 'space-evenly' } },
  'place-content-stretch': { output: { placeContent: 'stretch' } },

  // https://tailwindcss.com/docs/place-items
  'place-items-start': { output: { placeItems: 'start' } },
  'place-items-end': { output: { placeItems: 'end' } },
  'place-items-center': { output: { placeItems: 'center' } },
  'place-items-stretch': { output: { placeItems: 'stretch' } },

  // https://tailwindcss.com/docs/align-content
  'content-center': { output: { alignContent: 'center' } },
  'content-start': { output: { alignContent: 'flex-start' } },
  'content-end': { output: { alignContent: 'flex-end' } },
  'content-between': { output: { alignContent: 'space-between' } },
  'content-around': { output: { alignContent: 'space-around' } },
  'content-evenly': { output: { alignContent: 'space-evenly' } },

  // https://tailwindcss.com/docs/align-items
  'items-start': { output: { alignItems: 'flex-start' } },
  'items-end': { output: { alignItems: 'flex-end' } },
  'items-center': { output: { alignItems: 'center' } },
  'items-baseline': { output: { alignItems: 'baseline' } },
  'items-stretch': { output: { alignItems: 'stretch' } },

  // https://tailwindcss.com/docs/justify-content
  'justify-start': { output: { justifyContent: 'flex-start' } },
  'justify-end': { output: { justifyContent: 'flex-end' } },
  'justify-center': { output: { justifyContent: 'center' } },
  'justify-between': { output: { justifyContent: 'space-between' } },
  'justify-around': { output: { justifyContent: 'space-around' } },
  'justify-evenly': { output: { justifyContent: 'space-evenly' } },

  // https://tailwindcss.com/docs/justify-items
  'justify-items-start': { output: { justifyItems: 'start' } },
  'justify-items-end': { output: { justifyItems: 'end' } },
  'justify-items-center': { output: { justifyItems: 'center' } },
  'justify-items-stretch': { output: { justifyItems: 'stretch' } },

  // https://tailwindcss.com/docs/gap
  gap: { property: 'gap', config: 'gap' },
  'gap-x': { property: 'columnGap', config: 'gap' },
  'gap-y': { property: 'rowGap', config: 'gap' },

  // https://tailwindcss.com/docs/space
  'space-y': {
    config: 'space',
    output: ({ value }) => ({
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-space-y-reverse': '0',
        marginTop: `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
        marginBottom: `calc(${value} * var(--tw-space-y-reverse))`,
      },
    }),
    supportsNegativeValues: true,
  },
  'space-x': {
    config: 'space',
    output: ({ value }) => ({
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-space-x-reverse': '0',
        marginRight: `calc(${value} * var(--tw-space-x-reverse))`,
        marginLeft: `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
      },
    }),
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/space
  'space-x-reverse': {
    output: {
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-space-x-reverse': '1',
      },
    },
  },
  'space-y-reverse': {
    output: {
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-space-y-reverse': '1',
      },
    },
  },

  'divide-y': {
    config: 'divideWidth',
    output: ({ value }) => ({
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-divide-y-reverse': '0',
        borderTopWidth: `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
        borderBottomWidth: `calc(${value} * var(--tw-divide-y-reverse))`,
      },
    }),
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
    config: 'divideWidth',
    output: ({ value }) => ({
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-divide-x-reverse': '0',
        borderRightWidth: `calc(${value} * var(--tw-divide-x-reverse))`,
        borderLeftWidth: `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
      },
    }),
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
    config: 'divideColor',
    coerced: {
      color: {
        property: 'borderColor',
        variable: '--tw-divide-opacity',
        wrapWith: '> :not([hidden]) ~ :not([hidden])',
        forceReturn: true,
      },
    },
  },

  // https://tailwindcss.com/docs/divide-width
  'divide-x-reverse': {
    output: {
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-divide-x-reverse': '1',
      },
    },
  },
  'divide-y-reverse': {
    output: {
      '> :not([hidden]) ~ :not([hidden])': {
        '--tw-divide-y-reverse': '1',
      },
    },
  },

  // https://tailwindcss.com/docs/divide-style
  'divide-solid': {
    output: { '> :not([hidden]) ~ :not([hidden])': { borderStyle: 'solid' } },
  },
  'divide-dashed': {
    output: { '> :not([hidden]) ~ :not([hidden])': { borderStyle: 'dashed' } },
  },
  'divide-dotted': {
    output: { '> :not([hidden]) ~ :not([hidden])': { borderStyle: 'dotted' } },
  },
  'divide-double': {
    output: { '> :not([hidden]) ~ :not([hidden])': { borderStyle: 'double' } },
  },
  'divide-none': {
    output: { '> :not([hidden]) ~ :not([hidden])': { borderStyle: 'none' } },
  },

  // https://tailwindcss.com/docs/divide-width/
  'divide-opacity': {
    config: 'divideOpacity',
    property: '--tw-divide-opacity',
    output: ({ value }) => ({
      '> :not([hidden]) ~ :not([hidden])': { '--tw-divide-opacity': value },
    }),
  },

  // https://tailwindcss.com/docs/place-self
  'place-self-auto': { output: { placeSelf: 'auto' } },
  'place-self-start': { output: { placeSelf: 'start' } },
  'place-self-end': { output: { placeSelf: 'end' } },
  'place-self-center': { output: { placeSelf: 'center' } },
  'place-self-stretch': { output: { placeSelf: 'stretch' } },

  // https://tailwindcss.com/docs/align-self
  'self-auto': { output: { alignSelf: 'auto' } },
  'self-start': { output: { alignSelf: 'flex-start' } },
  'self-end': { output: { alignSelf: 'flex-end' } },
  'self-center': { output: { alignSelf: 'center' } },
  'self-stretch': { output: { alignSelf: 'stretch' } },
  'self-baseline': { output: { alignSelf: 'baseline' } },

  // https://tailwindcss.com/docs/justify-self
  'justify-self-auto': { output: { justifySelf: 'auto' } },
  'justify-self-start': { output: { justifySelf: 'start' } },
  'justify-self-end': { output: { justifySelf: 'end' } },
  'justify-self-center': { output: { justifySelf: 'center' } },
  'justify-self-stretch': { output: { justifySelf: 'stretch' } },

  // https://tailwindcss.com/docs/overflow
  'overflow-auto': { output: { overflow: 'auto' }, config: 'overflow' },
  'overflow-hidden': { output: { overflow: 'hidden' }, config: 'overflow' },
  'overflow-clip': { output: { overflow: 'clip' }, config: 'overflow' },
  'overflow-visible': { output: { overflow: 'visible' }, config: 'overflow' },
  'overflow-scroll': { output: { overflow: 'scroll' }, config: 'overflow' },
  'overflow-x-auto': { output: { overflowX: 'auto' }, config: 'overflow' },
  'overflow-y-auto': { output: { overflowY: 'auto' }, config: 'overflow' },
  'overflow-x-hidden': { output: { overflowX: 'hidden' }, config: 'overflow' },
  'overflow-y-hidden': { output: { overflowY: 'hidden' }, config: 'overflow' },
  'overflow-x-clip': { output: { overflowX: 'clip' }, config: 'overflow' },
  'overflow-y-clip': { output: { overflowY: 'clip' }, config: 'overflow' },
  'overflow-x-visible': {
    output: { overflowX: 'visible' },
    config: 'overflow',
  },
  'overflow-y-visible': {
    output: { overflowY: 'visible' },
    config: 'overflow',
  },
  'overflow-x-scroll': { output: { overflowX: 'scroll' }, config: 'overflow' },
  'overflow-y-scroll': { output: { overflowY: 'scroll' }, config: 'overflow' },

  // https://tailwindcss.com/docs/overscroll-behavior
  'overscroll-auto': { output: { overscrollBehavior: 'auto' } },
  'overscroll-contain': { output: { overscrollBehavior: 'contain' } },
  'overscroll-none': { output: { overscrollBehavior: 'none' } },
  'overscroll-y-auto': { output: { overscrollBehaviorY: 'auto' } },
  'overscroll-y-contain': { output: { overscrollBehaviorY: 'contain' } },
  'overscroll-y-none': { output: { overscrollBehaviorY: 'none' } },
  'overscroll-x-auto': { output: { overscrollBehaviorX: 'auto' } },
  'overscroll-x-contain': { output: { overscrollBehaviorX: 'contain' } },
  'overscroll-x-none': { output: { overscrollBehaviorX: 'none' } },

  // https://tailwindcss.com/docs/scroll-behavior
  'scroll-auto': { output: { scrollBehavior: 'auto' } },
  'scroll-smooth': { output: { scrollBehavior: 'smooth' } },

  // https://tailwindcss.com/docs/text-overflow
  truncate: {
    output: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  'overflow-ellipsis': { output: { textOverflow: 'ellipsis' } },
  'text-ellipsis': { output: { textOverflow: 'ellipsis' } }, // Deprecated
  'text-clip': { output: { textOverflow: 'clip' } },

  // https://tailwindcss.com/docs/whitespace
  'whitespace-normal': { output: { whiteSpace: 'normal' } },
  'whitespace-nowrap': { output: { whiteSpace: 'nowrap' } },
  'whitespace-pre': { output: { whiteSpace: 'pre' } },
  'whitespace-pre-line': { output: { whiteSpace: 'pre-line' } },
  'whitespace-pre-wrap': { output: { whiteSpace: 'pre-wrap' } },

  // https://tailwindcss.com/docs/word-break
  'break-normal': {
    output: { wordBreak: 'normal', overflowWrap: 'normal' },
    config: 'wordbreak',
  },
  'break-words': {
    output: { overflowWrap: 'break-word' },
    config: 'wordbreak',
  },
  'break-all': { output: { wordBreak: 'break-all' }, config: 'wordbreak' },

  // https://tailwindcss.com/docs/border-radius
  'rounded-t': {
    property: ['borderTopLeftRadius', 'borderTopRightRadius'],
    config: 'borderRadius',
  },
  'rounded-r': {
    property: ['borderTopRightRadius', 'borderBottomRightRadius'],
    config: 'borderRadius',
  },
  'rounded-b': {
    property: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    config: 'borderRadius',
  },
  'rounded-l': {
    property: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
    config: 'borderRadius',
  },
  'rounded-tl': { property: 'borderTopLeftRadius', config: 'borderRadius' },
  'rounded-tr': { property: 'borderTopRightRadius', config: 'borderRadius' },
  'rounded-br': { property: 'borderBottomRightRadius', config: 'borderRadius' },
  'rounded-bl': { property: 'borderBottomLeftRadius', config: 'borderRadius' },
  rounded: { property: 'borderRadius', config: 'borderRadius' },

  // https://tailwindcss.com/docs/border-style
  'border-solid': { output: { borderStyle: 'solid' } },
  'border-dashed': { output: { borderStyle: 'dashed' } },
  'border-dotted': { output: { borderStyle: 'dotted' } },
  'border-double': { output: { borderStyle: 'double' } },
  'border-hidden': { output: { borderStyle: 'hidden' } },
  'border-none': { output: { borderStyle: 'none' } },

  border: [
    // https://tailwindcss.com/docs/border-width
    {
      config: 'borderWidth',
      coerced: {
        'line-width': { property: 'borderWidth' },
        length: { property: 'borderWidth' },
      },
    },
    // https://tailwindcss.com/docs/border-color
    {
      config: 'borderColor',
      coerced: {
        color: { property: 'borderColor', variable: '--tw-border-opacity' },
      },
    },
  ],

  'border-x': [
    // https://tailwindcss.com/docs/border-width
    {
      config: 'borderWidth',
      coerced: {
        'line-width': {
          property: ['borderLeftWidth', 'borderRightWidth'],
        },
        length: {
          property: ['borderLeftWidth', 'borderRightWidth'],
        },
      },
    },
    // https://tailwindcss.com/docs/border-color
    {
      config: 'borderColor',
      coerced: {
        color: {
          property: ['borderLeftColor', 'borderRightColor'],
          variable: '--tw-border-opacity',
        },
      },
    },
  ],
  'border-y': [
    // https://tailwindcss.com/docs/border-width
    {
      config: 'borderWidth',
      coerced: {
        'line-width': {
          property: ['borderTopColor', 'borderBottomColor'],
        },
        length: {
          property: ['borderTopColor', 'borderBottomColor'],
        },
      },
    },
    // https://tailwindcss.com/docs/border-color
    {
      config: 'borderColor',
      coerced: {
        color: {
          property: ['borderTopColor', 'borderBottomColor'],
          variable: '--tw-border-opacity',
        },
      },
    },
  ],

  // https://tailwindcss.com/docs/border-width
  'border-t': [
    // https://tailwindcss.com/docs/border-width
    {
      config: 'borderWidth',
      coerced: {
        'line-width': { property: 'borderTopWidth' },
        length: { property: 'borderTopWidth' },
      },
    },
    // https://tailwindcss.com/docs/border-color
    {
      config: 'borderColor',
      coerced: {
        color: {
          property: 'borderTopColor',
          variable: '--tw-border-opacity',
        },
      },
    },
  ],
  'border-b': [
    // https://tailwindcss.com/docs/border-width
    {
      config: 'borderWidth',
      coerced: {
        'line-width': { property: 'borderBottomWidth' },
        length: { property: 'borderBottomWidth' },
      },
    },
    // https://tailwindcss.com/docs/border-color
    {
      config: 'borderColor',
      coerced: {
        color: {
          property: 'borderBottomColor',
          variable: '--tw-border-opacity',
        },
      },
    },
  ],
  'border-l': [
    // https://tailwindcss.com/docs/border-width
    {
      config: 'borderWidth',
      coerced: {
        'line-width': { property: 'borderLeftWidth' },
        length: { property: 'borderLeftWidth' },
      },
    },
    // https://tailwindcss.com/docs/border-color
    {
      config: 'borderColor',
      coerced: {
        color: {
          property: 'borderLeftColor',
          variable: '--tw-border-opacity',
        },
      },
    },
  ],
  'border-r': [
    // https://tailwindcss.com/docs/border-width
    {
      config: 'borderWidth',
      coerced: {
        'line-width': { property: 'borderRightWidth' },
        length: { property: 'borderRightWidth' },
      },
    },
    // https://tailwindcss.com/docs/border-color
    {
      config: 'borderColor',
      coerced: {
        color: {
          property: 'borderRightColor',
          variable: '--tw-border-opacity',
        },
      },
    },
  ],

  'border-opacity': {
    property: '--tw-border-opacity',
    config: 'borderOpacity',
  },

  bg: [
    // https://tailwindcss.com/docs/background-image
    // https://tailwindcss.com/docs/background-attachment
    {
      config: 'backgroundImage',
      coerced: {
        url: { property: 'backgroundImage' },
        image: { property: 'backgroundImage' },
      },
    },
    // https://tailwindcss.com/docs/background-position
    // https://tailwindcss.com/docs/background-origin
    {
      config: 'backgroundPosition',
      coerced: {
        position: { property: 'backgroundPosition' },
        percentage: { property: 'backgroundPosition' },
      },
    },
    // https://tailwindcss.com/docs/background-size
    {
      config: 'backgroundSize',
      coerced: { length: { property: 'backgroundSize' } },
    },
    // https://tailwindcss.com/docs/background-color
    {
      config: 'backgroundColor',
      coerced: {
        color: { property: 'backgroundColor', variable: '--tw-bg-opacity' },
      },
    },
  ],

  // https://tailwindcss.com/docs/background-opacity
  'bg-opacity': {
    property: '--tw-bg-opacity',
    config: 'backgroundOpacity',
  },

  // https://tailwindcss.com/docs/gradient-color-stops
  from: {
    config: 'gradientColorStops',
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
    config: 'gradientColorStops',
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
    config: 'gradientColorStops',
    coerced: {
      color: {
        output: (value, { withAlpha }) => ({
          '--tw-gradient-to': `${withAlpha(value) || value}`,
        }),
      },
    },
  },

  // https://tailwindcss.com/docs/box-decoration-break
  'decoration-slice': { output: { boxDecorationBreak: 'slice' } }, // Deprecated
  'decoration-clone': { output: { boxDecorationBreak: 'clone' } }, // Deprecated
  'box-decoration-slice': { output: { boxDecorationBreak: 'slice' } },
  'box-decoration-clone': { output: { boxDecorationBreak: 'clone' } },

  // https://tailwindcss.com/docs/background-attachment
  'bg-fixed': { output: { backgroundAttachment: 'fixed' } },
  'bg-local': { output: { backgroundAttachment: 'local' } },
  'bg-scroll': { output: { backgroundAttachment: 'scroll' } },

  // https://tailwindcss.com/docs/background-clip
  'bg-clip-border': { output: { backgroundClip: 'border-box' } },
  'bg-clip-padding': { output: { backgroundClip: 'padding-box' } },
  'bg-clip-content': { output: { backgroundClip: 'content-box' } },
  'bg-clip-text': { output: { backgroundClip: 'text' } },

  // https://tailwindcss.com/docs/background-repeat
  'bg-repeat': { output: { backgroundRepeat: 'repeat' } },
  'bg-no-repeat': { output: { backgroundRepeat: 'no-repeat' } },
  'bg-repeat-x': { output: { backgroundRepeat: 'repeat-x' } },
  'bg-repeat-y': { output: { backgroundRepeat: 'repeat-y' } },
  'bg-repeat-round': { output: { backgroundRepeat: 'round' } },
  'bg-repeat-space': { output: { backgroundRepeat: 'space' } },

  // https://tailwindcss.com/docs/background-origin
  'bg-origin-border': { output: { backgroundOrigin: 'border-box' } },
  'bg-origin-padding': { output: { backgroundOrigin: 'padding-box' } },
  'bg-origin-content': { output: { backgroundOrigin: 'content-box' } },

  // https://tailwindcss.com/docs/fill
  fill: {
    config: 'fill',
    coerced: { color: { property: 'fill' }, any: { property: 'fill' } },
  },

  stroke: [
    // https://tailwindcss.com/docs/stroke-width
    {
      config: 'strokeWidth',
      coerced: {
        length: { property: 'strokeWidth' },
        number: { property: 'strokeWidth' },
        percentage: { property: 'strokeWidth' },
      },
    },
    // https://tailwindcss.com/docs/stroke
    {
      config: 'stroke',
      coerced: {
        url: { property: 'stroke' },
        color: { property: 'stroke' },
      },
    },
  ],

  // https://tailwindcss.com/docs/object-fit
  'object-contain': { output: { objectFit: 'contain' } },
  'object-cover': { output: { objectFit: 'cover' } },
  'object-fill': { output: { objectFit: 'fill' } },
  'object-none': { output: { objectFit: 'none' } },
  'object-scale-down': { output: { objectFit: 'scale-down' } },

  // https://tailwindcss.com/docs/object-position
  object: { property: 'objectPosition', config: 'objectPosition' },

  // https://tailwindcss.com/docs/padding
  pt: { property: 'paddingTop', config: 'padding' },
  pr: { property: 'paddingRight', config: 'padding' },
  pb: { property: 'paddingBottom', config: 'padding' },
  pl: { property: 'paddingLeft', config: 'padding' },
  px: { property: ['paddingLeft', 'paddingRight'], config: 'padding' },
  py: { property: ['paddingTop', 'paddingBottom'], config: 'padding' },
  p: { property: 'padding', config: 'padding' },

  // https://tailwindcss.com/docs/text-align
  'text-left': { output: { textAlign: 'left' } },
  'text-center': { output: { textAlign: 'center' } },
  'text-right': { output: { textAlign: 'right' } },
  'text-justify': { output: { textAlign: 'justify' } },
  'text-start': { output: { textAlign: 'start' } },
  'text-end': { output: { textAlign: 'end' } },

  // https://tailwindcss.com/docs/text-indent
  indent: {
    config: 'textIndent',
    coerced: {
      length: { property: 'textIndent' },
      position: { property: 'textIndent' },
      lookup: { property: 'textIndent' },
    },
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/vertical-align
  'align-baseline': { output: { verticalAlign: 'baseline' } },
  'align-top': { output: { verticalAlign: 'top' } },
  'align-middle': { output: { verticalAlign: 'middle' } },
  'align-bottom': { output: { verticalAlign: 'bottom' } },
  'align-text-top': { output: { verticalAlign: 'text-top' } },
  'align-text-bottom': { output: { verticalAlign: 'text-bottom' } },
  'align-sub': { output: { verticalAlign: 'sub' } },
  'align-super': { output: { verticalAlign: 'super' } },
  align: { output: ({ value }) => value && { verticalAlign: value } },

  font: [
    // https://tailwindcss.com/docs/font-weight
    {
      config: 'fontWeight',
      coerced: { number: { property: 'fontWeight' } },
    },
    // https://tailwindcss.com/docs/font-family
    {
      config: 'fontFamily',
      coerced: {
        'generic-name': { property: 'fontFamily' },
        'family-name': { property: 'fontFamily' },
      },
    },
  ],

  // https://tailwindcss.com/docs/text-transform
  uppercase: { output: { textTransform: 'uppercase' } },
  lowercase: { output: { textTransform: 'lowercase' } },
  capitalize: { output: { textTransform: 'capitalize' } },
  'normal-case': { output: { textTransform: 'none' } },

  // https://tailwindcss.com/docs/font-style
  italic: { output: { fontStyle: 'italic' } },
  'not-italic': { output: { fontStyle: 'normal' } },

  // https://tailwindcss.com/docs/font-variant-numeric
  'normal-nums': { output: { fontVariantNumeric: 'normal' } },
  ordinal: {
    output: {
      '--tw-ordinal': 'ordinal',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },
  'slashed-zero': {
    output: {
      '--tw-slashed-zero': 'slashed-zero',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },
  'lining-nums': {
    output: {
      '--tw-numeric-figure': 'lining-nums',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },
  'oldstyle-nums': {
    output: {
      '--tw-numeric-figure': 'oldstyle-nums',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },
  'proportional-nums': {
    output: {
      '--tw-numeric-spacing': 'proportional-nums',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },
  'tabular-nums': {
    output: {
      '--tw-numeric-spacing': 'tabular-nums',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },
  'diagonal-fractions': {
    output: {
      '--tw-numeric-fraction': 'diagonal-fractions',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },
  'stacked-fractions': {
    output: {
      '--tw-numeric-fraction': 'stacked-fractions',
      fontVariantNumeric: cssFontVariantNumericValue,
    },
  },

  // https://tailwindcss.com/docs/line-height
  leading: { property: 'lineHeight', config: 'lineHeight' },

  // https://tailwindcss.com/docs/letter-spacing
  tracking: {
    property: 'letterSpacing',
    config: 'letterSpacing',
    supportsNegativeValues: true,
  },

  text: [
    // https://tailwindcss.com/docs/text-color
    {
      config: 'textColor',
      coerced: {
        color: {
          property: 'color',
          variable: '--tw-text-opacity',
        },
      },
    },
    // https://tailwindcss.com/docs/font-size
    {
      config: 'fontSize',
      coerced: {
        'absolute-size': { property: 'fontSize' },
        'relative-size': { property: 'fontSize' },
        length: { property: 'fontSize' },
        percentage: { property: 'fontSize' },
      },
    },
  ],

  'text-opacity': { property: '--tw-text-opacity', config: 'textOpacity' },

  // https://tailwindcss.com/docs/text-decoration
  underline: { output: { textDecorationLine: 'underline' } },
  overline: { output: { textDecorationLine: 'overline' } },
  'line-through': { output: { textDecorationLine: 'line-through' } },
  'no-underline': { output: { textDecorationLine: 'none' } },

  decoration: [
    // https://tailwindcss.com/docs/text-decoration-color
    {
      config: 'textDecorationColor',
      coerced: { color: { property: 'textDecorationColor' } },
    },
    // https://tailwindcss.com/docs/text-decoration-thickness
    {
      config: 'textDecorationThickness',
      coerced: {
        length: { property: 'textDecorationThickness' },
        percentage: { property: 'textDecorationThickness' },
        any: { property: 'textDecorationThickness' },
      },
    },
  ],

  // https://tailwindcss.com/docs/text-decoration-style
  'decoration-solid': { output: { textDecorationStyle: 'solid' } },
  'decoration-double': { output: { textDecorationStyle: 'double' } },
  'decoration-dotted': { output: { textDecorationStyle: 'dotted' } },
  'decoration-dashed': { output: { textDecorationStyle: 'dashed' } },
  'decoration-wavy': { output: { textDecorationStyle: 'wavy' } },

  // https://tailwindcss.com/docs/text-underline-offset
  'underline-offset': {
    config: 'textUnderlineOffset',
    coerced: {
      length: { property: 'textUnderlineOffset' },
      percentage: { property: 'textUnderlineOffset' },
    },
  },

  // https://tailwindcss.com/docs/font-smoothing
  antialiased: {
    output: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
  },
  'subpixel-antialiased': {
    output: { WebkitFontSmoothing: 'auto', MozOsxFontSmoothing: 'auto' },
  },

  // https://tailwindcss.com/docs/placeholder-color
  placeholder: {
    config: 'placeholderColor',
    coerced: {
      color: {
        property: 'color',
        variable: '--tw-placeholder-opacity',
        wrapWith: '::placeholder',
      },
      any: {
        property: 'color',
        wrapWith: '::placeholder',
      },
    },
  },

  // https://tailwindcss.com/docs/placeholder-opacity
  'placeholder-opacity': {
    config: 'placeholderOpacity',
    output: ({ value }) => ({
      '::placeholder': { '--tw-placeholder-opacity': value },
    }),
  },

  // https://tailwindcss.com/docs/caret-color
  caret: {
    config: 'caretColor',
    coerced: {
      color: { property: 'caretColor' },
      any: { property: 'caretColor' },
    },
  },

  // https://tailwindcss.com/docs/accent-color
  accent: {
    config: 'accentColor',
    coerced: {
      color: { property: 'accentColor' },
      any: { property: 'accentColor' },
    },
  },

  // https://tailwindcss.com/docs/opacity
  opacity: { property: 'opacity', config: 'opacity' },

  // https://tailwindcss.com/docs/background-blend-mode
  'bg-blend-normal': { output: { backgroundBlendMode: 'normal' } },
  'bg-blend-multiply': { output: { backgroundBlendMode: 'multiply' } },
  'bg-blend-screen': { output: { backgroundBlendMode: 'screen' } },
  'bg-blend-overlay': { output: { backgroundBlendMode: 'overlay' } },
  'bg-blend-darken': { output: { backgroundBlendMode: 'darken' } },
  'bg-blend-lighten': { output: { backgroundBlendMode: 'lighten' } },
  'bg-blend-color-dodge': { output: { backgroundBlendMode: 'color-dodge' } },
  'bg-blend-color-burn': { output: { backgroundBlendMode: 'color-burn' } },
  'bg-blend-hard-light': { output: { backgroundBlendMode: 'hard-light' } },
  'bg-blend-soft-light': { output: { backgroundBlendMode: 'soft-light' } },
  'bg-blend-difference': { output: { backgroundBlendMode: 'difference' } },
  'bg-blend-exclusion': { output: { backgroundBlendMode: 'exclusion' } },
  'bg-blend-hue': { output: { backgroundBlendMode: 'hue' } },
  'bg-blend-saturation': { output: { backgroundBlendMode: 'saturation' } },
  'bg-blend-color': { output: { backgroundBlendMode: 'color' } },
  'bg-blend-luminosity': { output: { backgroundBlendMode: 'luminosity' } },

  // https://tailwindcss.com/docs/mix-blend-mode
  'mix-blend-normal': { output: { mixBlendMode: 'normal' } },
  'mix-blend-multiply': { output: { mixBlendMode: 'multiply' } },
  'mix-blend-screen': { output: { mixBlendMode: 'screen' } },
  'mix-blend-overlay': { output: { mixBlendMode: 'overlay' } },
  'mix-blend-darken': { output: { mixBlendMode: 'darken' } },
  'mix-blend-lighten': { output: { mixBlendMode: 'lighten' } },
  'mix-blend-color-dodge': { output: { mixBlendMode: 'color-dodge' } },
  'mix-blend-color-burn': { output: { mixBlendMode: 'color-burn' } },
  'mix-blend-hard-light': { output: { mixBlendMode: 'hard-light' } },
  'mix-blend-soft-light': { output: { mixBlendMode: 'soft-light' } },
  'mix-blend-difference': { output: { mixBlendMode: 'difference' } },
  'mix-blend-exclusion': { output: { mixBlendMode: 'exclusion' } },
  'mix-blend-hue': { output: { mixBlendMode: 'hue' } },
  'mix-blend-saturation': { output: { mixBlendMode: 'saturation' } },
  'mix-blend-color': { output: { mixBlendMode: 'color' } },
  'mix-blend-luminosity': { output: { mixBlendMode: 'luminosity' } },

  shadow: [
    // https://tailwindcss.com/docs/box-shadow
    {
      config: 'boxShadow',
      coerced: { shadow: { config: 'boxShadow' } },
    },
    // https://tailwindcss.com/docs/box-shadow-color
    {
      config: 'boxShadowColor',
      coerced: {
        color: {
          output: (value, { withAlpha }) => ({
            '--tw-shadow-color': withAlpha(value) || value,
            '--tw-shadow': 'var(--tw-shadow-colored)',
          }),
        },
      },
    },
  ],

  // https://tailwindcss.com/docs/outline-style
  'outline-none': {
    output: { outline: '2px solid transparent', outlineOffset: '2px' },
  },
  'outline-dashed': { output: { outlineStyle: 'dashed' } },
  'outline-dotted': { output: { outlineStyle: 'dotted' } },
  'outline-double': { output: { outlineStyle: 'double' } },
  'outline-hidden': { output: { outlineStyle: 'hidden' } },

  outline: [
    { output: { outlineStyle: 'solid' } },
    // https://tailwindcss.com/docs/outline-width
    {
      config: 'outlineWidth',
      coerced: {
        length: { property: 'outlineWidth' },
        number: { property: 'outlineWidth' },
        percentage: { property: 'outlineWidth' },
      },
    },
    // https://tailwindcss.com/docs/outline-color
    {
      config: 'outlineColor',
      coerced: { color: { property: 'outlineColor' } },
    },
  ],

  // https://tailwindcss.com/docs/outline-offset
  'outline-offset': {
    config: 'outlineOffset',
    coerced: {
      length: { property: 'outlineOffset' },
      number: { property: 'outlineOffset' },
      percentage: { property: 'outlineOffset' },
    },
  },

  ring: [
    // https://tailwindcss.com/docs/ring-width
    {
      config: 'ringWidth',
      coerced: {
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
    // https://tailwindcss.com/docs/ring-color
    {
      config: 'ringColor',
      coerced: {
        color: { property: '--tw-ring-color', variable: '--tw-ring-opacity' },
      },
    },
  ],

  'ring-inset': { output: { '--tw-ring-inset': 'inset' } },

  // https://tailwindcss.com/docs/ring-opacity
  'ring-opacity': { property: '--tw-ring-opacity', config: 'ringOpacity' },

  'ring-offset': [
    // https://tailwindcss.com/docs/ring-offset-width
    {
      config: 'ringOffsetWidth',
      coerced: { length: { property: '--tw-ring-offset-width' } },
    },
    // https://tailwindcss.com/docs/ring-offset-color
    {
      config: 'ringOffsetColor',
      coerced: { color: { property: '--tw-ring-offset-color' } },
    },
  ],

  // https://tailwindcss.com/docs/blur
  blur: {
    config: 'blur',
    output: ({ value }) => ({
      '--tw-blur': `blur(${value})`,
      filter: cssFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/brightness
  brightness: {
    config: 'brightness',
    output: ({ value }) => ({
      '--tw-brightness': `brightness(${value})`,
      filter: cssFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/contrast
  contrast: {
    config: 'contrast',
    output: ({ value }) => ({
      '--tw-contrast': `contrast(${value})`,
      filter: cssFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/drop-shadow
  'drop-shadow': {
    config: 'dropShadow',
    output({ value }) {
      const dropShadowValue = Array.isArray(value)
        ? value.map(v => `drop-shadow(${v})`).join(' ')
        : `drop-shadow(${value})`
      return {
        '--tw-drop-shadow': dropShadowValue,
        filter: cssFilterValue,
      }
    },
  },

  // https://tailwindcss.com/docs/grayscale
  grayscale: {
    config: 'grayscale',
    output: ({ value }) => ({
      '--tw-grayscale': `grayscale(${value})`,
      filter: cssFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/hue-rotate
  'hue-rotate': {
    config: 'hueRotate',
    output: ({ value }) => ({
      '--tw-hue-rotate': `hue-rotate(${value})`,
      filter: cssFilterValue,
    }),
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/invert
  invert: {
    config: 'invert',
    output: ({ value }) => ({
      '--tw-invert': `invert(${value})`,
      filter: cssFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/saturate
  saturate: {
    config: 'saturate',
    output: ({ value }) => ({
      '--tw-saturate': `saturate(${value})`,
      filter: cssFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/sepia
  sepia: {
    config: 'sepia',
    output: ({ value }) => ({
      '--tw-sepia': `sepia(${value})`,
      filter: cssFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/filter
  'filter-none': { output: { filter: 'none' } },
  filter: { output: { filter: cssFilterValue } },

  // https://tailwindcss.com/docs/backdrop-blur
  'backdrop-blur': {
    config: 'backdropBlur',
    output: ({ value }) => ({
      '--tw-backdrop-blur': `blur(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-brightness
  'backdrop-brightness': {
    config: 'backdropBrightness',
    output: ({ value }) => ({
      '--tw-backdrop-brightness': `brightness(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-contrast
  'backdrop-contrast': {
    config: 'backdropContrast',
    output: ({ value }) => ({
      '--tw-backdrop-contrast': `contrast(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-grayscale
  'backdrop-grayscale': {
    config: 'backdropGrayscale',
    output: ({ value }) => ({
      '--tw-backdrop-grayscale': `grayscale(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-hue-rotate
  'backdrop-hue-rotate': {
    config: 'backdropHueRotate',
    output: ({ value }) => ({
      '--tw-backdrop-hue-rotate': `hue-rotate(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
    supportsNegativeValues: true,
  },

  // https://tailwindcss.com/docs/backdrop-invert
  'backdrop-invert': {
    config: 'backdropInvert',
    output: ({ value }) => ({
      '--tw-backdrop-invert': `invert(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-opacity
  'backdrop-opacity': {
    config: 'backdropOpacity',
    output: ({ value }) => ({
      '--tw-backdrop-opacity': `opacity(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-saturate
  'backdrop-saturate': {
    config: 'backdropSaturate',
    output: ({ value }) => ({
      '--tw-backdrop-saturate': `saturate(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-sepia
  'backdrop-sepia': {
    config: 'backdropSepia',
    output: ({ value }) => ({
      '--tw-backdrop-sepia': `sepia(${value})`,
      backdropFilter: cssBackdropFilterValue,
    }),
  },

  // https://tailwindcss.com/docs/backdrop-filter
  'backdrop-filter': {
    output: { backdropFilter: cssBackdropFilterValue },
  },
  'backdrop-filter-none': { output: { backdropFilter: 'none' } },

  // https://tailwindcss.com/docs/transtiion-property
  // Note: Tailwind doesn't allow an arbitrary value but it's likely just an accident so it's been added here
  transition: [
    {
      config: 'transitionProperty',
      output({ value, theme }) {
        const defaultTimingFunction = theme('transitionTimingFunction.DEFAULT')
        const defaultDuration = theme('transitionDuration.DEFAULT')
        return {
          transitionProperty: value,
          ...(value === 'none'
            ? {}
            : {
                transitionTimingFunction: defaultTimingFunction,
                transitionDuration: defaultDuration,
              }),
        }
      },
      coerced: {
        lookup: (value, theme) => ({
          transitionProperty: value,
          transitionTimingFunction: theme('transitionTimingFunction.DEFAULT'),
          transitionDuration: theme('transitionDuration.DEFAULT'),
        }),
      },
    },
  ],

  // https://tailwindcss.com/docs/transition-delay
  delay: { property: 'transitionDelay', config: 'transitionDelay' },

  // https://tailwindcss.com/docs/transition-duration
  duration: { property: 'transitionDuration', config: 'transitionDuration' },

  // https://tailwindcss.com/docs/transition-timing-function
  ease: {
    property: 'transitionTimingFunction',
    config: 'transitionTimingFunction',
  },

  // https://tailwindcss.com/docs/will-change
  'will-change': { property: 'willChange', config: 'willChange' },

  // https://tailwindcss.com/docs/content
  content: [
    {
      config: 'content',
      output({ value, isEmotion }) {
        // Temp fix until emotion supports css variables with the content property
        if (isEmotion) return { content: value }
        return { '--tw-content': value, content: 'var(--tw-content)' }
      },
    },
    { output: { content: '""' } }, // Deprecated (keep last in array here)
  ],
}
