import * as babel from '@babel/core'
import macros from 'babel-plugin-macros'
import jsx from '@babel/plugin-transform-react-jsx'
// eslint-disable-next-line import/no-relative-parent-imports
import type { TailwindConfig, TwinConfig } from '../types'

export const html = String.raw

export async function run(
  input: string,
  tailwindConfig?: TailwindConfig | undefined,
  twinConfig?: TwinConfig
): Promise<string> {
  return babelTransform(input, { tailwindConfig, twinConfig })
}

export async function babelTransform(
  input: string,
  options: { tailwindConfig?: TailwindConfig; twinConfig?: TwinConfig }
): Promise<string> {
  const babelOptions = babel.loadOptions({
    plugins: [
      [jsx, { pure: false }],
      [
        macros,
        {
          twin: {
            hasLogColors: false,
            ...options.twinConfig,
            ...(options.tailwindConfig && { config: options.tailwindConfig }),
          },
        },
      ],
    ],
  })
  if (!babelOptions) return '' // Type guard

  const twinImports = `import tw, { styled, globalStyles, GlobalStyles, screen } from './twin.macro'`
  const inputWithImports = `${twinImports};${input}`
  const transformed = await babel.transformAsync(inputWithImports, babelOptions)
  return transformed?.code ?? ''
}
