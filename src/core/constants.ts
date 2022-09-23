const CLASS_SEPARATOR = /\S+/g
const DEFAULTS_UNIVERSAL = '*, ::before, ::after'
const EMPTY_CSS_VARIABLE_VALUE = 'var(--tw-empty,/*!*/ /*!*/)'
const HANDLED_ATRULE_TYPES = new Set([
  'document',
  'media',
  'page',
  'screen',
  'supports',
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
  HANDLED_ATRULE_TYPES,
  LAYER_DEFAULTS,
  LINEFEED,
  SPACE_ID,
  SPACE,
  SPACES,
  WORD_CHARACTER,
}
