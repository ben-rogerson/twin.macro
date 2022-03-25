import {
  parseBoxShadowValue,
  formatBoxShadowValue,
} from 'tailwindcss/lib/util/parseBoxShadowValue'

const defaultBoxShadow = [
  `var(--tw-ring-offset-shadow, 0 0 #0000)`,
  `var(--tw-ring-shadow, 0 0 #0000)`,
  `var(--tw-shadow)`,
].join(', ')

const makeBoxShadow = (value, important) => {
  const ast = parseBoxShadowValue(value)
  for (const shadow of ast) {
    // Don't override color if the whole shadow is a variable
    if (!shadow.valid) {
      continue
    }

    shadow.color = 'var(--tw-shadow-color)'
  }

  return {
    '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
    '--tw-shadow-colored':
      value === 'none' ? '0 0 #0000' : formatBoxShadowValue(ast),
    boxShadow: `${defaultBoxShadow}${important}`,
  }
}

export { makeBoxShadow }
