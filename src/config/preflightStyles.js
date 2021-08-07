/**
 * Embedding modern-normalize here is the best option right now as converting
 * the css file to a string causes syntax errors.
 * So these styles must be kept in sync with the remote package for now.
 * https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css
 */
const modernNormalizeStyles = {
  '*, ::before, ::after': { boxSizing: 'border-box' },
  html: {
    lineHeight: '1.15',
    WebkitTextSizeAdjust: '100%',
    MozTabSize: '4',
    tabSize: '4',
  },
  body: {
    margin: '0',
    fontFamily:
      "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
  },
  hr: { height: '0', color: 'inherit' },
  'abbr[title]': { textDecoration: 'underline dotted' },
  'b, strong': { fontWeight: 'bolder' },
  'code, kbd, samp, pre': {
    fontFamily:
      "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
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
  table: { textIndent: '0', borderColor: 'inherit' },
  'button, input, optgroup, select, textarea': {
    fontFamily: 'inherit',
    fontSize: '100%',
    lineHeight: '1.15',
    margin: '0',
  },
  'button, select': { textTransform: 'none' },
  "button, [type='button'], [type='reset'], [type='submit']": {
    WebkitAppearance: 'button',
  },
  '::-moz-focus-inner': { borderStyle: 'none', padding: '0' },
  ':-moz-focusring': { outline: '1px dotted ButtonText' },
  ':-moz-ui-invalid': { boxShadow: 'none' },
  legend: { padding: '0' },
  progress: { verticalAlign: 'baseline' },
  '::-webkit-inner-spin-button, ::-webkit-outer-spin-button': {
    height: 'auto',
  },
  "[type='search']": { WebkitAppearance: 'textfield', outlineOffset: '-2px' },
  '::-webkit-search-decoration': { WebkitAppearance: 'none' },
  '::-webkit-file-upload-button': {
    WebkitAppearance: 'button',
    font: 'inherit',
  },
  summary: { display: 'list-item' },
}

/**
 * These are the same base styles tailwindcss uses.
 * I've stripped the comments as there were too many syntax errors after
 * converting it from css to a string.
 * https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/src/plugins/css/preflight.css
 */
const globalPreflightStyles = ({ theme, withAlpha }) => ({
  'blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
    margin: '0',
  },
  button: { backgroundColor: 'transparent', backgroundImage: 'none' },
  // Css object styles can't have duplicate keys.
  // This means fallbacks can't be specified like they can in css.
  // Here we use a bogus `:not` for a different key without adding extra specificity.
  'button:focus:not(/**/)': {
    outline: '1px dotted',
  },
  'button:focus': {
    outline: '5px auto -webkit-focus-ring-color',
  },
  fieldset: { margin: '0', padding: '0' },
  'ol, ul': { listStyle: 'none', margin: '0', padding: '0' },
  html: {
    fontFamily:
      theme`fontFamily.sans` ||
      `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    lineHeight: '1.5',
  },
  body: { fontFamily: 'inherit', lineHeight: 'inherit' },
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
  hr: { borderTopWidth: '1px' },
  img: { borderStyle: 'solid' },
  textarea: { resize: 'vertical' },
  'input::placeholder, textarea::placeholder': {
    color: theme`colors.gray.400` || '#a1a1aa',
  },
  'button, [role="button"]': { cursor: 'pointer' },
  table: { borderCollapse: 'collapse' },
  'h1, h2, h3, h4, h5, h6': {
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },
  a: { color: 'inherit', textDecoration: 'inherit' },
  'button, input, optgroup, select, textarea': {
    padding: '0',
    lineHeight: 'inherit',
    color: 'inherit',
  },
  'pre, code, kbd, samp': {
    fontFamily:
      theme`fontFamily.mono` ||
      `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  },
  'img, svg, video, canvas, audio, iframe, embed, object': {
    display: 'block',
    verticalAlign: 'middle',
  },
  'img, video': { maxWidth: '100%', height: 'auto' },
  '[hidden]': { display: 'none' },
})

export { modernNormalizeStyles, globalPreflightStyles }
