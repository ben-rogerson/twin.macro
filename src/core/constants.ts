const CLASS_SEPARATOR = /\S+/g
const DEFAULTS_UNIVERSAL = '*, ::before, ::after'
const EMPTY_CSS_VARIABLE_VALUE = 'var(--tw-empty,/*!*/ /*!*/)'
const PRESERVED_ATRULE_TYPES = new Set([
  'charset',
  'counter-style',
  'document',
  'font-face',
  'font-feature-values',
  'import',
  'keyframes',
  'namespace',
])
const LAYER_DEFAULTS = 'defaults'
const LINEFEED = /\n/g
const WORD_CHARACTER = /\w/
const SPACE_ID = '_'
const SPACE = /\s/
const SPACES = /\s+/g

export {
  CLASS_SEPARATOR,
  DEFAULTS_UNIVERSAL,
  EMPTY_CSS_VARIABLE_VALUE,
  PRESERVED_ATRULE_TYPES,
  LAYER_DEFAULTS,
  LINEFEED,
  SPACE_ID,
  SPACE,
  SPACES,
  WORD_CHARACTER,
}
