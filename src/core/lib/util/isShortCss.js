import escapeRegex from './escapeRegex'

const SHORT_CSS = /[^/-]\\\[(?!.+:)/
export default className => SHORT_CSS.test(escapeRegex(className))
