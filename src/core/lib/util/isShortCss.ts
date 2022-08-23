import escapeRegex from './escapeRegex'

const SHORT_CSS = /[^/-]\\\[(?!.+:)/

export default function isShortCss(className: string): boolean {
  return SHORT_CSS.test(escapeRegex(className))
}
