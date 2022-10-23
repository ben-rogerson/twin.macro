import type { ExtractRuleStyles } from 'core/types'

const SELECTOR_PARENT_CANDIDATE = /^[ #.[]/
const SELECTOR_ROOT = /(^| ):root(?!\w)/g
const UNDERSCORE_ESCAPING = /\\+(_)/g
const WRAPPED_PARENT_SELECTORS = /(\({3}&(.*?)\){3})/g

type SassifySelectorTasks = Array<
  (
    selector: string,
    params: { selectorMatchReg: RegExp; sassyPseudo: boolean }
  ) => string
>

const sassifySelectorTasks: SassifySelectorTasks = [
  (selector): string => selector.trim(),

  // Prefix with the parent selector when sassyPseudo is enabled,
  // otherwise just replace the class with the parent selector
  (selector, { selectorMatchReg, sassyPseudo }): string =>
    selector.replace(selectorMatchReg, (match, __, offset: number) => {
      if (selector === match) return ''
      if (sassyPseudo) return '&'
      if (
        /\w/.test(selector[offset - 1]) &&
        selector[offset + match.length] === ':'
      )
        return '' // Cover [section&]:hover:block / .btn.loading&:before
      return offset === 0 ? '' : '&'
    }),

  // Unwrap the pre-wrapped parent selectors (pre-wrapping avoids matching issues against word characters, eg: `[&section]:block`)
  (selector): string => selector.replace(WRAPPED_PARENT_SELECTORS, '&$2'),

  // Remove unneeded escaping from the selector
  (selector): string => selector.replace(UNDERSCORE_ESCAPING, '$1'),

  // Prefix classes/ids/attribute selectors with a parent selector so styles
  // are applied to the current element rather than its children
  (selector): string => {
    if (selector.includes('&')) return selector

    const addParentSelector = SELECTOR_PARENT_CANDIDATE.test(selector)

    if (!addParentSelector) return selector

    // ` > :not([hidden]) ~ :not([hidden])` / ` > *`
    if (selector.startsWith(' >')) return selector

    return `&${selector}`
  },

  // Fix the spotty `:root` support in emotion/styled-components
  (selector): string => selector.replace(SELECTOR_ROOT, '*:root'),

  (selector): string => selector.trim(),
]

function sassifySelector(
  selector: string,
  params: ExtractRuleStyles & { selectorMatchReg: RegExp; sassyPseudo: boolean }
): string {
  // Remove the selector if it only contains the parent selector
  if (selector === '&') {
    params.debug('selector not required', selector)
    return ''
  }

  for (const task of sassifySelectorTasks) {
    selector = task(selector, params)
  }

  return selector
}

export default sassifySelector
