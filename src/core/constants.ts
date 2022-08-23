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
const CLASS_SEPARATOR = /\S+/g
const WORD_CHARACTER = /\w/
const LINEFEED = /\n/g
export const SPACE = /\s/
export const SPACES = /\s+/g

export {
  SPACE_ID,
  DEFAULTS_UNIVERSAL,
  EMPTY_CSS_VARIABLE_VALUE,
  HANDLED_ATRULE_TYPES,
  LAYER_DEFAULTS,
  CLASS_SEPARATOR,
  WORD_CHARACTER,
  LINEFEED,
}
