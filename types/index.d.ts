import { ComponentType } from 'react'
import { Config as TailwindConfig } from 'tailwindcss'

export interface TwStyle {
  [key: string]: string | number | TwStyle
}

export const GlobalStyles: string

export type TemplateFn<R> = (
  strings: Readonly<TemplateStringsArray>,
  ...values: readonly string[]
) => R

export type TwFn = TemplateFn<TwStyle>

export type ThemeSearchFn<R> = (...values: readonly string[]) => R
export type ThemeSearchTaggedFn<R> = (
  strings: Readonly<TemplateStringsArray>
) => R

export type ThemeFn = <T = string>(arg?: string | TemplateStringsArray) => T

export type ScreenFn = <T = string>(
  screenValue: string | TemplateStringsArray | string[]
) => (styles?: string | TemplateStringsArray | TwStyle | TwStyle[]) => T

export type TwComponent<K extends keyof JSX.IntrinsicElements> = (
  props: JSX.IntrinsicElements[K]
) => JSX.Element

export type TwComponentMap = {
  [K in keyof JSX.IntrinsicElements]: TemplateFn<TwComponent<K>>
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type TwComponentWrapper = <T extends ComponentType<any>>(
  component: T
) => TemplateFn<T>

declare const tw: TwFn & TwComponentMap & TwComponentWrapper
export default tw

declare module 'react' {
  interface DOMAttributes<T> {
    tw?: string
  }
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    cs?: string
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      tw?: string
    }
  }
}

// Docs: https://github.com/ben-rogerson/twin.macro/blob/master/docs/options.md
export type Config = {
  /**
   * The css-in-js library behind the scenes, default is `emotion`.
   */
  preset?: 'styled-components' | 'emotion' | 'goober' | 'stitches' | 'solid'
  /**
   * Visit `style={...}` props/attributes for classes.
   */
  allowStyleProp?: boolean
  /**
   * The path to your Tailwind config. Also takes a TailwindConfig object.
   */
  config?: string | Partial<TailwindConfig>
  /**
   * For packages like stitches, add a styled definition on css prop elements.
   */
  convertHtmlElementToStyled?: boolean
  /**
   * Convert `styled.[element]``` to `styled('element', ({}))`.
   */
  convertStyledDotToParam?: boolean
  /**
   * Convert `styled.[element]``` to `styled('element')({})`.
   */
  convertStyledDotToFunction?: boolean
  /**
   * Add a prop to your elements in development so you can see the original cs prop classes, eg: `<div data-cs="maxWidth[1em]" />`.
   */
  dataCsProp?: boolean | 'all'
  /**
   * Add a prop to jsx components in development showing the original tailwind classes. Use `"all"` to keep the prop in production.
   */
  dataTwProp?: boolean | 'all'
  /**
   * Display information in your terminal about the Tailwind class conversions.
   */
  debug?: boolean
  /**
   * Disable twin from reading values specified in the cs prop.
   */
  disableCsProp?: boolean
  /**
   * Disable converting short css within the tw import/prop.
   */
  disableShortCss?: boolean
  /**
   * Disable log colors to remove the glyphs when the color display is not supported.
   */
  hasLogColors?: boolean
  /**
   * Look in className props for tailwind classes to convert.
   */
  includeClassNames?: boolean
  /**
   * `@keyframes` are added next to the `animation-x` classes - this option can move them to global styles instead.
   */
  moveKeyframesToGlobalStyles?: boolean
  /**
   * Move the tw prop to a styled definition.
   */
  moveTwPropToStyled?: boolean
  /**
   * Some css-in-js frameworks require the `&` in selectors like `&:hover`, this option ensures it’s added.
   */
  sassyPseudo?: boolean
  /**
   * This is the path to your config (stitches only).
   */
  stitchesConfig?: string
  /**
   * Overwrite the css prop based import, eg: `import: 'css', from: '@emotion/react'`.
   */
  css?: { import: string; from: string }
  /**
   * Overwrite the styled import, eg: `import: 'default', from: '@emotion/styled'`.
   */
  styled?: { import: string; from: string }
  /**
   * Overwrite the import used for global styles, eg: `import: 'Global', from: '@emotion/react'`.
   */
  global?: { import: string; from: string }
}

declare const theme: ThemeFn
declare const screen: ScreenFn
declare const globalStyles: Record<string, unknown>

export { theme, screen, globalStyles }
