import toArray from './util/toArray'
import type { PluginAPI } from 'tailwindcss/types/config'

const AMPERSAND_AFTER = /&(.+)/g
const AMPERSAND = /&/g

function stripAmpersands(string: string): string {
  return typeof string === 'string'
    ? string.replace(AMPERSAND, '').trim()
    : string
}

const EXTRA_VARIANTS = [
  ['all', '& *'],
  ['all-child', '& > *'],
  ['sibling', '& ~ *'],
  ['hocus', ['&:hover', '&:focus']],
  'link',
  'read-write',
  ['svg', '& svg'],
  ['even-of-type', '&:nth-of-type(even)'],
  ['odd-of-type', '&:nth-of-type(odd)'],
]

const EXTRA_NOT_VARIANTS = [
  // Positional
  ['first', '&:first-child'],
  ['last', '&:last-child'],
  ['only', '&:only-child'],
  ['odd', '&:nth-child(odd)'],
  ['even', '&:nth-child(even)'],
  'first-of-type',
  'last-of-type',
  'only-of-type',

  // State
  'target',
  ['open', '&[open]'],

  // Forms
  'default',
  'checked',
  'indeterminate',
  'placeholder-shown',
  'autofill',
  'optional',
  'required',
  'valid',
  'invalid',
  'in-range',
  'out-of-range',
  'read-only',

  // Content
  'empty',

  // Interactive
  'focus-within',
  'hover',
  'focus',
  'focus-visible',
  'active',
  'enabled',
  'disabled',
]

function defaultVariants({ config, addVariant }: PluginAPI): void {
  const extraVariants = EXTRA_VARIANTS.flatMap(v => {
    let [name, selector] = toArray(v)
    selector = selector || `&:${String(name)}`
    const variant = [name, selector]

    // Create a :not() version of the selectors above
    const notVariant = [
      `not-${String(name)}`,
      (toArray(selector) as string[]).map(
        (s: string) => `&:not(${stripAmpersands(s)})`
      ),
    ]

    return [variant, notVariant]
  })

  // Create :not() versions of these selectors
  const notPseudoVariants = EXTRA_NOT_VARIANTS.map(v => {
    const [name, selector] = toArray(v)
    const notConfig = [
      `not-${name as string}`,
      (toArray(selector || `&:${name as string}`) as string[]).map(
        s => `&:not(${stripAmpersands(s)})`
      ),
    ]

    return notConfig
  })

  const variants = [...extraVariants, ...notPseudoVariants]

  for (const [name, selector] of variants) {
    addVariant(name as string, toArray(selector) as string[])
  }

  for (const [name, selector] of variants) {
    const groupSelector = (toArray(selector) as string[]).map(s =>
      s.replace(AMPERSAND_AFTER, ':merge(.group)$1 &')
    )
    addVariant(`group-${name as string}`, groupSelector)
  }

  for (const [name, selector] of variants) {
    const peerSelector = (toArray(selector) as string[]).map(s =>
      s.replace(AMPERSAND_AFTER, ':merge(.peer)$1 ~ &')
    )
    addVariant(`peer-${name as string}`, peerSelector)
  }

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
  addVariant('any-pointer-none', '@media (any-pointer: none)')
  addVariant('any-pointer-fine', '@media (any-pointer: fine)')
  addVariant('any-pointer-coarse', '@media (any-pointer: coarse)')

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
  addVariant('pointer-none', '@media (pointer: none)')
  addVariant('pointer-fine', '@media (pointer: fine)')
  addVariant('pointer-coarse', '@media (pointer: coarse)')

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover
  addVariant('any-hover-none', '@media (any-hover: none)')
  addVariant('any-hover', '@media (any-hover: hover)')

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
  addVariant('can-hover', '@media (hover: hover)')
  addVariant('cant-hover', '@media (hover: none)')

  addVariant('screen', '@media screen')

  // Light mode

  // eslint-disable-next-line unicorn/prefer-spread
  let [mode, className = '.light'] = ([] as Array<string | boolean>).concat(
    config('lightMode', 'media')
  )

  if (mode === false) mode = 'media'

  if (mode === 'class') {
    addVariant('light', `${String(className)} &`)
  } else if (mode === 'media') {
    addVariant('light', '@media (prefers-color-scheme: light)')
  }

  // eslint-disable-next-line unicorn/prefer-spread
  ;[mode, className = '.light'] = ([] as string[]).concat(
    config('lightMode', 'media')
  )

  if (mode === 'class') {
    addVariant('light', `${className} &`)
  } else if (mode === 'media') {
    addVariant('light', '@media (prefers-color-scheme: light)')
  }
}

const defaultTailwindConfig = {
  presets: [
    {
      content: [''], // Silence empty content warning
      theme: {
        extend: {
          content: { DEFAULT: '' }, // Add a `content` class
          zIndex: { 1: '1' }, // Add a handy small zIndex (`z-1` / `-z-1`)
        },
      },
      plugins: [defaultVariants], // Add extra variants
    },
  ],
}

export default defaultTailwindConfig
