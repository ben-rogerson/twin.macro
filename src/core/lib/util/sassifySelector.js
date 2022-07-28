const SELECTOR_PARENT_CANDIDATE = /^[ #.[]/
const SELECTOR_ROOT = /(^| ):root(?!\w)/g

const sassifySelectorTasks = [
  selector => selector.trim(),

  // Prefix with the parent selector when sassyPseudo is enabled,
  // otherwise just replace the class with the parent selector
  (selector, { selectorMatchReg, sassyPseudo }) =>
    selector.replace(selectorMatchReg, (match, __, offset) =>
      selector === match || (offset === 0 && sassyPseudo === false) ? '' : '&'
    ),

  // Prefix classes/ids/attribute selectors with a parent selector so styles
  // are applied to the current element rather than its children
  selector => {
    if (selector.includes('&')) return selector

    const addParentSelector = SELECTOR_PARENT_CANDIDATE.test(selector)

    if (!addParentSelector) return selector

    // ` > :not([hidden]) ~ :not([hidden])` / ` > *`
    if (selector.startsWith(' >')) return selector

    return `&${selector}`
  },

  // Fix the spotty `:root` support in emotion/styled-components
  selector => selector.replace(SELECTOR_ROOT, '*:root'),

  selector => selector.trim(),
]

const sassifySelector = (selector, params) => {
  // Remove the selector if it only contains the parent selector
  if (selector === `.${params.className}` || selector === '&') {
    params.debug('selector not required', selector)
    return ''
  }

  for (const task of sassifySelectorTasks) {
    selector = task(selector, params)
  }

  return selector
}

export default sassifySelector
