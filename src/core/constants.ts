const SPACE_ID = '_'
const SPACE_ID_TEMP = '{{SPACE}}'
const DEFAULTS_UNIVERSAL = '*, ::before, ::after'
const EMPTY_CSS_VARIABLE_VALUE = 'var(--tw-empty,/*!*/ /*!*/)'
const HANDLED_ATRULE_TYPES = new Set([
  'screen',
  'media',
  'supports',
  'page',
  'document',
])
const SPACE_ID_TEMP_ALL = /{{SPACE}}/g
const LAYER_DEFAULTS = 'defaults'
const CLASS_SEPARATOR = /\S+/g
const WORD_CHARACTER = /\w/
const LINEFEED = /\n/g
export const SPACE = /\s/
export const SPACES = /\s+/g

export {
  SPACE_ID_TEMP,
  SPACE_ID,
  DEFAULTS_UNIVERSAL,
  EMPTY_CSS_VARIABLE_VALUE,
  HANDLED_ATRULE_TYPES,
  SPACE_ID_TEMP_ALL,
  LAYER_DEFAULTS,
  CLASS_SEPARATOR,
  WORD_CHARACTER,
  LINEFEED,
}
