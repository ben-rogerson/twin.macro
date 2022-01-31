const globalPreflightStyles = ({ theme, withAlpha }) => ({
  '*, ::before, ::after': {
    boxSizing: 'border-box',
    borderWidth: '0',
    borderStyle: 'solid',
    ...withAlpha({
      color: theme`borderColor.DEFAULT` || 'currentColor',
      property: 'borderColor',
      pieces: { important: '' },
      variable: '--tw-border-opacity',
    }),
  },
  '::before, ::after': {
    '--tw-content': "''",
  },
  html: {
    lineHeight: '1.5',
    WebkitTextSizeAdjust: '100%',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    fontFamily:
      theme`fontFamily.sans` ||
      `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  },
  body: { margin: '0', lineHeight: 'inherit' },
  hr: { height: '0', color: 'inherit', borderTopWidth: '1px' },
  'abbr:where([title])': {
    WebkitTextDecoration: 'underline dotted',
    textDecoration: 'underline dotted',
  },
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

export { globalPreflightStyles }
