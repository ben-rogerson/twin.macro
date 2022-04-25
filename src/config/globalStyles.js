// Reference: https://github.com/tailwindlabs/tailwindcss/blob/master/src/css/preflight.css
export const globalPreflightStyles = ({ theme }) => ({
  '*, ::before, ::after': {
    boxSizing: 'border-box',
    borderWidth: '0',
    borderStyle: 'solid',
    borderColor: theme`borderColor.DEFAULT` || 'currentColor',
  },
  '::before, ::after': { '--tw-content': "''" },
  html: {
    lineHeight: '1.5',
    WebkitTextSizeAdjust: '100%',
    MozTabSize: '4',
    tabSize: '4',
    fontFamily:
      theme`fontFamily.sans` ||
      `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  },
  body: { margin: '0', lineHeight: 'inherit' },
  hr: { height: '0', color: 'inherit', borderTopWidth: '1px' },
  'abbr:where([title])': { textDecoration: 'underline dotted' },
  'h1, h2, h3, h4, h5, h6': { fontSize: 'inherit', fontWeight: 'inherit' },
  a: { color: 'inherit', textDecoration: 'inherit' },
  'b, strong': { fontWeight: 'bolder' },
  'code, kbd, samp, pre': {
    fontFamily:
      theme`fontFamily.mono` ||
      `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    fontSize: '1em',
  },
  small: { fontSize: '80%' },
  'sub, sup': {
    fontSize: '75%',
    lineHeight: '0',
    position: 'relative',
    verticalAlign: 'baseline',
  },
  sub: { bottom: '-0.25em' },
  sup: { top: '-0.5em' },
  table: {
    textIndent: '0',
    borderColor: 'inherit',
    borderCollapse: 'collapse',
  },
  'button, input, optgroup, select, textarea': {
    fontFamily: 'inherit',
    fontSize: '100%',
    lineHeight: 'inherit',
    color: 'inherit',
    margin: '0',
    padding: '0',
  },
  'button, select': { textTransform: 'none' },
  'button, [type="button"], [type="reset"], [type="submit"]': {
    WebkitAppearance: 'button',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
  ':-moz-focusring': { outline: 'auto' },
  ':-moz-ui-invalid': { boxShadow: 'none' },
  progress: { verticalAlign: 'baseline' },
  '::-webkit-inner-spin-button, ::-webkit-outer-spin-button': {
    height: 'auto',
  },
  '[type="search"]': { WebkitAppearance: 'textfield', outlineOffset: '-2px' },
  '::-webkit-search-decoration': { WebkitAppearance: 'none' },
  '::-webkit-file-upload-button': {
    WebkitAppearance: 'button',
    font: 'inherit',
  },
  summary: { display: 'list-item' },
  'blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
    margin: '0',
  },
  fieldset: { margin: '0', padding: '0' },
  legend: { padding: '0' },
  'ol, ul, menu': { listStyle: 'none', margin: '0', padding: '0' },
  textarea: { resize: 'vertical' },
  'input::-moz-placeholder, textarea::-moz-placeholder': {
    opacity: '1',
    color: theme`colors.gray.400` || '#9ca3af',
  },
  'input:-ms-input-placeholder, textarea:-ms-input-placeholder': {
    opacity: '1',
    color: theme`colors.gray.400` || '#9ca3af',
  },
  'input::placeholder, textarea::placeholder': {
    opacity: '1',
    color: theme`colors.gray.400` || '#9ca3af',
  },
  'button, [role="button"]': { cursor: 'pointer' },
  ':disabled, [disabled]': { cursor: 'default' }, // Gotcha: :disabled doesn't seem to work with css-in-js so added [disabled] as a backup
  'img, svg, video, canvas, audio, iframe, embed, object': {
    display: 'block',
    verticalAlign: 'middle',
  },
  'img, video': { maxWidth: '100%', height: 'auto' },
  '[hidden]': { display: 'none' },
})

export const globalRingStyles = ({ theme, withAlpha }) => {
  const ringOpacityDefault = theme`ringOpacity.DEFAULT` || '0.5'
  const ringColorDefault = withAlpha({
    color:
      theme`ringColor.DEFAULT` || `rgb(147 197 253 / ${ringOpacityDefault})`,
    pieces: { important: '', hasAlpha: true, alpha: ringOpacityDefault },
  })
  return {
    '*, ::before, ::after': {
      '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-ring-offset-width': theme`ringOffsetWidth.DEFAULT` || '0px',
      '--tw-ring-offset-color': theme`ringOffsetColor.DEFAULT` || '#fff',
      '--tw-ring-color': ringColorDefault,
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
    },
  }
}

export const globalTransformStyles = {
  '*, ::before, ::after': {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
  },
}

export const globalTouchActionStyles = {
  '*, ::before, ::after': {
    '--tw-pan-x': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-pan-y': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-pinch-zoom': 'var(--tw-empty,/*!*/ /*!*/)',
  },
}

export const globalScrollSnapTypeStyles = {
  '*, ::before, ::after': {
    '--tw-scroll-snap-strictness': 'proximity',
  },
}

export const globalFontVariantNumericStyles = {
  '*, ::before, ::after': {
    '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
  },
}

export const globalBoxShadowStyles = {
  '*, ::before, ::after': {
    '--tw-shadow': '0 0 #0000',
    '--tw-shadow-colored': '0 0 #0000',
  },
}

export const globalFilterStyles = {
  '*, ::before, ::after': {
    '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
  },
}

export const globalBackdropStyles = {
  '*, ::before, ::after': {
    '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
  },
}

export const globalKeyframeStyles = ({ theme }) => {
  const keyframes = theme('keyframes')
  if (!keyframes) return
  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/prefer-object-from-entries
  const output = Object.entries(keyframes).reduce(
    (result, [name, frames]) => ({ ...result, [`@keyframes ${name}`]: frames }),
    {}
  )
  return output
}

const globalStyles = [
  globalPreflightStyles,
  globalKeyframeStyles,
  globalTransformStyles,
  globalTouchActionStyles,
  globalScrollSnapTypeStyles,
  globalFontVariantNumericStyles,
  globalRingStyles,
  globalBoxShadowStyles,
  globalFilterStyles,
  globalBackdropStyles,
]

export default globalStyles
