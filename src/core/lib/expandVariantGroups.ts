import type { TailwindConfig } from 'core/types'
import { splitAtTopLevelOnly } from './util/twImports'

const BRACKETED = /^\(.*?\)$/
const BRACKETED_MAYBE_IMPORTANT = /\)!?$/
const NEW_LINE = /\n/g

type Context = {
  variants?: string
  beforeImportant?: string
  afterImportant?: string
  tailwindConfig: TailwindConfig
}

function spreadVariantGroups(classes: string, context: Context): string[] {
  const pieces = [
    ...splitAtTopLevelOnly(
      classes.trim(),
      context.tailwindConfig.separator ?? ':'
    ),
  ] as string[]

  let groupedClasses = pieces.pop()
  if (!groupedClasses) return [] // type guard

  let beforeImportant = context?.beforeImportant ?? ''
  let afterImportant = context?.afterImportant ?? ''

  if (!beforeImportant && groupedClasses.startsWith('!')) {
    groupedClasses = groupedClasses.slice(1)
    beforeImportant = '!'
  }

  if (!afterImportant && groupedClasses.endsWith('!')) {
    groupedClasses = groupedClasses.slice(0, -1)
    afterImportant = '!'
  }

  // Remove () brackets and split
  const unwrapped = BRACKETED.test(groupedClasses)
    ? groupedClasses.slice(1, -1)
    : groupedClasses

  const classList = [...splitAtTopLevelOnly(unwrapped, ' ')].filter(Boolean)

  const group = classList
    .map(className => {
      if (BRACKETED_MAYBE_IMPORTANT.test(className)) {
        const ctx = { ...context, beforeImportant, afterImportant }
        return expandVariantGroups(
          [...pieces, className].join(context.tailwindConfig.separator ?? ':'),
          ctx
        )
      }

      return [...pieces, [beforeImportant, className, afterImportant].join('')]
        .filter(Boolean)
        .join(context.tailwindConfig.separator ?? ':')
    })
    .filter(Boolean)

  return group
}

function expandVariantGroups(classes: string, context: Context): string {
  const classList = [
    ...splitAtTopLevelOnly(classes.replace(NEW_LINE, ' ').trim(), ' '),
  ]
  const expandedClasses = classList.flatMap(item =>
    spreadVariantGroups(item, context)
  )

  return expandedClasses.join(' ')
}

export default expandVariantGroups
