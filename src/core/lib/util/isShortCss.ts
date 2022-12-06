import { splitAtTopLevelOnly } from './twImports'
import type { TailwindConfig } from 'core/types'

export default function isShortCss(
  fullClassName: string,
  tailwindConfig: TailwindConfig
): boolean {
  const classPieces = [
    ...splitAtTopLevelOnly(fullClassName, tailwindConfig.separator ?? ':'),
  ]

  const className = classPieces.slice(-1)[0]

  if (!className.includes('[')) return false

  // Replace brackets before splitting on them as the split function already
  // reads brackets to determine where the top level is
  const splitAtArbitrary = [
    ...splitAtTopLevelOnly(className.replace(/\[/g, '∀'), '∀'),
  ]

  // Normal class
  if (splitAtArbitrary[0].endsWith('-')) return false

  // Important suffix
  if (splitAtArbitrary[0].endsWith('!')) return false

  // Arbitrary property
  if (splitAtArbitrary[0] === '') return false

  // Slash opacity, eg: bg-red-500/fromConfig/[.555]
  if (splitAtArbitrary[0].endsWith('/')) return false

  return true
}
