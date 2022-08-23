const REGEX_SPECIAL_CHARACTERS = /[$()*+./?[\\\]^{|}-]/g

export default function escapeRegex(string: string): string {
  return string.replace(REGEX_SPECIAL_CHARACTERS, '\\$&')
}
