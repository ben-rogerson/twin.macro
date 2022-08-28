import type { CoreContext, MacroParams } from 'macro/types'

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
  imports: MacroParams['references'],
  coreContext: CoreContext
): void {
  const importTwAsNamedNotDefault = Object.keys(imports).find(
    reference => reference === 'tw'
  )
  coreContext.assert(
    !importTwAsNamedNotDefault,
    ({ color }) =>
      `${color(
        `✕ import { tw } from 'twin.macro'`
      )}\n\nUse the default export for \`tw\`:\n\n${color(
        `import tw from 'twin.macro'`,
        'success'
      )}`
  )

  const unsupportedImport = Object.keys(imports).find(
    reference => !validImports.has(reference)
  )
  coreContext.assert(
    !unsupportedImport,
    ({ color }) =>
      `${color(
        `✕ Twin doesn't recognize { ${String(unsupportedImport)} }`
      )}\n\nTry one of these imports:\n\nimport ${color(
        'tw',
        'success'
      )}, { ${color('styled', 'success')}, ${color('css', 'success')}, ${color(
        'theme',
        'success'
      )}, ${color('screen', 'success')}, ${color(
        'GlobalStyles',
        'success'
      )}, ${color('globalStyles', 'success')} } from 'twin.macro'`
  )
}
