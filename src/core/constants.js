const SPACE_ID = '_'
const DEFAULTS_UNIVERSAL = '*, ::before, ::after'
const EMPTY_CSS_VARIABLE_VALUE = 'var(--tw-empty,/*!*/ /*!*/)'
const HANDLED_ATRULE_TYPES = new Set([
  'screen',
  'media',
  'supports',
  'page',
  'document',
])
const LAYER_DEFAULTS = 'defaults'
const COMMAS_OUTSIDE_BRACKETS =
  /,(?=(?:(?:(?!\)).)*\()|[^()]*$)(?=(?:(?:(?!]).)*\[)|[^[\]]*$)/g
const IMPORTANT_OUTSIDE_BRACKETS =
  /(:!|^!)(?=(?:(?:(?!\)).)*\()|[^()]*$)(?=(?:(?:(?!]).)*\[)|[^[\]]*$)/
const COMMENTS_MULTI_LINE = /(?<!\/)\/(?!\/)\*[\S\s]*?\*\//g
const COMMENTS_SINGLE_LINE = /(?<!:)\/\/.*/g
const CLASS_DIVIDER_PIPE = / \| /g

export {
  SPACE_ID,
  DEFAULTS_UNIVERSAL,
  COMMAS_OUTSIDE_BRACKETS,
  EMPTY_CSS_VARIABLE_VALUE,
  HANDLED_ATRULE_TYPES,
  LAYER_DEFAULTS,
  IMPORTANT_OUTSIDE_BRACKETS,
  COMMENTS_MULTI_LINE,
  COMMENTS_SINGLE_LINE,
  CLASS_DIVIDER_PIPE,
}
