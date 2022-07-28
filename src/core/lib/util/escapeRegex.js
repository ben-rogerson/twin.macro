const REGEX_SPECIAL_CHARACTERS = /[$()*+./?[\\\]^{|}-]/g

export default string => string.replace(REGEX_SPECIAL_CHARACTERS, '\\$&')
