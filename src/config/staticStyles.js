const staticStyles = {
  /**
   * ===========================================
   * Layout
   */

  // https://tailwindcss.com/docs/container
  // TODO: Add container generation plugin

  // https://tailwindcss.com/docs/box-sizing
  'box-border': { output: { 'box-sizing': 'border-box' } },
  'box-content': { output: { 'box-sizing': 'content-box' } },

  // https://tailwindcss.com/docs/display
  hidden: { output: { display: 'none' } },
  block: { output: { display: 'block' } },
  'inline-block': { output: { display: 'inline-block' } },
  inline: { output: { display: 'inline' } },
  'flow-root': { output: { display: 'flow-root' } },
  flex: { output: { display: 'flex' } },
  'inline-flex': { output: { display: 'inline-flex' } },
  grid: { output: { display: 'grid' } },
  'inline-grid': { output: { display: 'inline-grid' } },
  table: { output: { display: 'table' } },
  'table-caption': { output: { display: 'table-caption' } },
  'table-cell': { output: { display: 'table-cell' } },
  'table-column': { output: { display: 'table-column' } },
  'table-column-group': { output: { display: 'table-column-group' } },
  'table-footer-group': { output: { display: 'table-footer-group' } },
  'table-header-group': { output: { display: 'table-header-group' } },
  'table-row-group': { output: { display: 'table-row-group' } },
  'table-row': { output: { display: 'table-row' } },

  // https://tailwindcss.com/docs/float
  'float-right': { output: { float: 'right' } },
  'float-left': { output: { float: 'left' } },
  'float-none': { output: { float: 'none' } },
  clearfix: {
    output: { '::after': { content: '""', display: 'table', clear: 'both' } },
    config: false,
  },

  // https://tailwindcss.com/docs/clear
  'clear-left': { output: { clear: 'left' } },
  'clear-right': { output: { clear: 'right' } },
  'clear-both': { output: { clear: 'both' } },
  'clear-none': { output: { clear: 'none' } },

  // https://tailwindcss.com/docs/object-fit
  'object-contain': { output: { objectFit: 'contain' } },
  'object-cover': { output: { objectFit: 'cover' } },
  'object-fill': { output: { objectFit: 'fill' } },
  'object-none': { output: { objectFit: 'none' } },
  'object-scale-down': { output: { objectFit: 'scale-down' } },

  // https://tailwindcss.com/docs/object-position
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/overflow
  'overflow-auto': { output: { overflow: 'auto' }, config: 'overflow' },
  'overflow-hidden': { output: { overflow: 'hidden' }, config: 'overflow' },
  'overflow-visible': { output: { overflow: 'visible' }, config: 'overflow' },
  'overflow-scroll': { output: { overflow: 'scroll' }, config: 'overflow' },
  'overflow-x-auto': { output: { overflowX: 'auto' }, config: 'overflow' },
  'overflow-y-auto': { output: { overflowY: 'auto' }, config: 'overflow' },
  'overflow-x-hidden': { output: { overflowX: 'hidden' }, config: 'overflow' },
  'overflow-y-hidden': { output: { overflowY: 'hidden' }, config: 'overflow' },
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
  'scrolling-touch': {
    output: { WebkitOverflowScrolling: 'touch' },
    config: false,
  },
  'scrolling-auto': {
    output: { WebkitOverflowScrolling: 'auto' },
    config: false,
  },

  // https://tailwindcss.com/docs/position
  static: { output: { position: 'static' } },
  fixed: { output: { position: 'fixed' } },
  absolute: { output: { position: 'absolute' } },
  relative: { output: { position: 'relative' } },
  sticky: { output: { position: 'sticky' } },

  // https://tailwindcss.com/docs/top-right-bottom-left
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/visibility
  visible: { output: { visibility: 'visible' } },
  invisible: { output: { visibility: 'hidden' } },

  // https://tailwindcss.com/docs/z-index
  // See dynamicStyles.js

  /**
   * ===========================================
   * Flexbox
   */

  // https://tailwindcss.com/docs/flexbox-direction
  'flex-row': { output: { flexDirection: 'row' } },
  'flex-row-reverse': { output: { flexDirection: 'row-reverse' } },
  'flex-col': { output: { flexDirection: 'column' } },
  'flex-col-reverse': {
    output: { flexDirection: 'column-reverse' },
  },

  // https://tailwindcss.com/docs/flex-wrap
  'flex-no-wrap': { output: { flexWrap: 'nowrap' } },
  'flex-wrap': { output: { flexWrap: 'wrap' } },
  'flex-wrap-reverse': { output: { flexWrap: 'wrap-reverse' } },

  // https://tailwindcss.com/docs/align-items
  'items-stretch': { output: { alignItems: 'stretch' } },
  'items-start': { output: { alignItems: 'flex-start' } },
  'items-center': { output: { alignItems: 'center' } },
  'items-end': { output: { alignItems: 'flex-end' } },
  'items-baseline': { output: { alignItems: 'baseline' } },

  // https://tailwindcss.com/docs/align-content
  'content-start': {
    output: { alignContent: 'flex-start' },
  },
  'content-center': {
    output: { alignContent: 'center' },
  },
  'content-end': {
    output: { alignContent: 'flex-end' },
  },
  'content-between': {
    output: { alignContent: 'space-between' },
  },
  'content-around': {
    output: { alignContent: 'space-around' },
  },

  // https://tailwindcss.com/docs/align-self
  'self-auto': { output: { alignSelf: 'auto' } },
  'self-start': { output: { alignSelf: 'flex-start' } },
  'self-center': { output: { alignSelf: 'center' } },
  'self-end': { output: { alignSelf: 'flex-end' } },
  'self-stretch': { output: { alignSelf: 'stretch' } },

  // https://tailwindcss.com/docs/justify-content
  'justify-start': {
    output: { justifyContent: 'flex-start' },
  },
  'justify-center': {
    output: { justifyContent: 'center' },
  },
  'justify-end': {
    output: { justifyContent: 'flex-end' },
  },
  'justify-between': {
    output: { justifyContent: 'space-between' },
  },
  'justify-around': {
    output: { justifyContent: 'space-around' },
  },

  // https://tailwindcss.com/docs/flex
  // https://tailwindcss.com/docs/flex-grow
  // https://tailwindcss.com/docs/flex-shrink
  // https://tailwindcss.com/docs/order
  // See dynamicStyles.js

  /**
   * ===========================================
   * Grid
   */

  // https://tailwindcss.com/docs/grid-template-columns
  // https://tailwindcss.com/docs/grid-column
  // https://tailwindcss.com/docs/grid-template-rows
  // https://tailwindcss.com/docs/grid-row
  // https://tailwindcss.com/docs/gap
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/grid-auto-flow
  'grid-flow-row': { output: { gridAutoFlow: 'row' } },
  'grid-flow-col': { output: { gridAutoFlow: 'column' } },
  'grid-flow-row-dense': { output: { gridAutoFlow: 'row dense' } },
  'grid-flow-col-dense': { output: { gridAutoFlow: 'col dense' } },

  /**
   * ===========================================
   * Spacing
   */

  // https://tailwindcss.com/docs/padding
  // https://tailwindcss.com/docs/margin
  // https://tailwindcss.com/docs/space
  // See dynamicStyles.js

  /**
   * ===========================================
   * Sizing
   */

  // https://tailwindcss.com/docs/width
  // https://tailwindcss.com/docs/min-width
  // https://tailwindcss.com/docs/max-width
  // https://tailwindcss.com/docs/height
  // https://tailwindcss.com/docs/min-height
  // https://tailwindcss.com/docs/max-height
  // See dynamicStyles.js

  /**
   * ===========================================
   * Typography
   */

  // https://tailwindcss.com/docs/font-family
  // https://tailwindcss.com/docs/font-size
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/font-smoothing
  antialiased: {
    output: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    config: false,
  },
  'subpixel-antialiased': {
    output: {
      WebkitFontSmoothing: 'auto',
      MozOsxFontSmoothing: 'auto',
    },
    config: false,
  },

  // https://tailwindcss.com/docs/font-style
  italic: { output: { fontStyle: 'italic' } },
  'not-italic': { output: { fontStyle: 'normal' } },

  // https://tailwindcss.com/docs/font-weight
  // https://tailwindcss.com/docs/letter-spacing
  // https://tailwindcss.com/docs/line-height
  // https://tailwindcss.com/docs/list-style-type
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/list-style-position
  'list-inside': { output: { listStylePosition: 'inside' } },
  'list-outside': { output: { listStylePosition: 'outside' } },

  // https://tailwindcss.com/docs/placeholder-color
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/text-align
  'text-left': { output: { textAlign: 'left' } },
  'text-center': { output: { textAlign: 'center' } },
  'text-right': { output: { textAlign: 'right' } },
  'text-justify': { output: { textAlign: 'justify' } },

  // https://tailwindcss.com/docs/text-color
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/text-decoration
  underline: { output: { textDecoration: 'underline' } },
  'line-through': { output: { textDecoration: 'line-through' } },
  'no-underline': { output: { textDecoration: 'none' } },

  // https://tailwindcss.com/docs/text-transform
  uppercase: { output: { textTransform: 'uppercase' } },
  lowercase: { output: { textTransform: 'lowercase' } },
  capitalize: { output: { textTransform: 'capitalize' } },
  'normal-case': { output: { textTransform: 'none' } },

  // https://tailwindcss.com/docs/vertical-align
  'align-baseline': { output: { verticalAlign: 'baseline' } },
  'align-top': { output: { verticalAlign: 'top' } },
  'align-middle': { output: { verticalAlign: 'middle' } },
  'align-bottom': { output: { verticalAlign: 'bottom' } },
  'align-text-top': { output: { verticalAlign: 'text-top' } },
  'align-text-bottom': { output: { verticalAlign: 'text-bottom' } },

  // https://tailwindcss.com/docs/whitespace
  'whitespace-normal': { output: { whiteSpace: 'normal' } },
  'whitespace-no-wrap': { output: { whiteSpace: 'nowrap' } },
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
  truncate: {
    output: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    config: false,
  },

  /**
   * ===========================================
   * Backgrounds
   */

  // https://tailwindcss.com/docs/background-attachment
  'bg-fixed': { output: { backgroundAttachment: 'fixed' } },
  'bg-local': { output: { backgroundAttachment: 'local' } },
  'bg-scroll': { output: { backgroundAttachment: 'scroll' } },

  // https://tailwindcss.com/docs/background-color
  // https://tailwindcss.com/docs/background-size
  // https://tailwindcss.com/docs/background-position
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/background-repeat
  'bg-repeat': { output: { backgroundRepeat: 'repeat' } },
  'bg-no-repeat': { output: { backgroundRepeat: 'no-repeat' } },
  'bg-repeat-x': { output: { backgroundRepeat: 'repeat-x' } },
  'bg-repeat-y': { output: { backgroundRepeat: 'repeat-y' } },
  'bg-repeat-round': { output: { backgroundRepeat: 'round' } },
  'bg-repeat-space': { output: { backgroundRepeat: 'space' } },

  // https://tailwindcss.com/docs/background-size
  // See dynamicStyles.js

  /**
   * ===========================================
   * Borders
   */

  // https://tailwindcss.com/docs/border-color
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/border-style
  'border-solid': { output: { borderStyle: 'solid' } },
  'border-dashed': { output: { borderStyle: 'dashed' } },
  'border-dotted': { output: { borderStyle: 'dotted' } },
  'border-double': { output: { borderStyle: 'double' } },
  'border-none': { output: { borderStyle: 'none' } },

  // https://tailwindcss.com/docs/border-width
  // https://tailwindcss.com/docs/border-radius
  // See dynamicStyles.js

  /**
   * ===========================================
   * Tables
   */

  // https://tailwindcss.com/docs/border-collapse
  'border-collapse': {
    output: { borderCollapse: 'collapse' },
  },
  'border-separate': {
    output: { borderCollapse: 'separate' },
  },

  // https://tailwindcss.com/docs/table-layout
  'table-auto': { output: { tableLayout: 'auto' } },
  'table-fixed': { output: { tableLayout: 'fixed' } },

  /**
   * ===========================================
   * Effects
   */

  // https://tailwindcss.com/docs/box-shadow/
  // https://tailwindcss.com/docs/opacity
  // See dynamicStyles.js

  /**
   * ===========================================
   * Transitions
   */

  // https://tailwindcss.com/docs/transition-property
  // https://tailwindcss.com/docs/transition-duration
  // https://tailwindcss.com/docs/transition-timing-function
  // See dynamicStyles.js

  /**
   * ===========================================
   * Transforms
   */

  // https://tailwindcss.com/docs/scale
  // https://tailwindcss.com/docs/rotate
  // https://tailwindcss.com/docs/translate
  // https://tailwindcss.com/docs/skew
  // https://tailwindcss.com/docs/transform-origin
  // See dynamicStyles.js

  /**
   * ===========================================
   * Interactivity
   */

  // https://tailwindcss.com/docs/appearance
  'appearance-none': { output: { appearance: 'none' } },

  // https://tailwindcss.com/docs/cursor
  // See dynamicStyles.js

  // https://tailwindcss.com/docs/outline
  'outline-none': { output: { outline: 0 } },

  // https://tailwindcss.com/docs/pointer-events
  'pointer-events-none': {
    output: { pointerEvents: 'none' },
  },
  'pointer-events-auto': {
    output: { pointerEvents: 'auto' },
  },

  // https://tailwindcss.com/docs/resize
  'resize-none': { output: { resize: 'none' } },
  'resize-y': { output: { resize: 'vertical' } },
  'resize-x': { output: { resize: 'horizontal' } },
  resize: { output: { resize: 'both' } },

  // https://tailwindcss.com/docs/user-select
  'select-none': { output: { userSelect: 'none' } },
  'select-text': { output: { userSelect: 'text' } },
  'select-all': { output: { userSelect: 'all' } },
  'select-auto': { output: { userSelect: 'auto' } },

  /**
   * ===========================================
   * Svg
   */

  // https://tailwindcss.com/docs/fill
  // https://tailwindcss.com/docs/stroke
  // https://tailwindcss.com/docs/stroke
  // See dynamicStyles.js

  /**
   * ===========================================
   * Accessibility
   */

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

  /**
   * ===========================================
   * Special classes
   */

  transform: {
    output: {
      '--transform-translate-x': '0',
      '--transform-translate-y': '0',
      '--transform-rotate': '0',
      '--transform-skew-x': '0',
      '--transform-skew-y': '0',
      '--transform-scale-x': '1',
      '--transform-scale-y': '1',
      transform:
        'translateX(var(--transform-translate-x)) translateY(var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))',
    },
    config: false,
  },

  /**
   * ===========================================
   * Extras
   * Extra styles that aren't part of Tailwind
   */

  content: {
    output: { content: '""' },
    config: false,
  },
}

export default staticStyles
