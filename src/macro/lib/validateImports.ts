import { logGeneralError } from './logging'
import throwIf from './util/throwIf'
// eslint-disable-next-line import/no-relative-parent-imports
import type { MacroParams } from './../types'

const validImports = new Set([
  'default',
  'styled',
  'css',
  'theme',
  'screen',
  'TwStyle',
  'TwComponent',
  'ThemeStyle',
  'GlobalStyles',
  'globalStyles',
])

export default function validateImports(
  imports: MacroParams['references']
): void {
  const unsupportedImport = Object.keys(imports).find(
    reference => !validImports.has(reference)
  )
  const importTwAsNamedNotDefault = Object.keys(imports).find(
    reference => reference === 'tw'
  )
  throwIf(importTwAsNamedNotDefault, (): string =>
    logGeneralError(
      `Please use the default export for twin.macro, i.e:\nimport tw from 'twin.macro'\nNOT import { tw } from 'twin.macro'`
    )
  )
  throwIf(unsupportedImport, (): string =>
    logGeneralError(
      `Twin doesn't recognize { ${
        unsupportedImport ?? ''
      } }\n\nTry one of these imports:\nimport tw, { styled, css, theme, screen, GlobalStyles, globalStyles } from 'twin.macro'`
    )
  )
}
