import { ComponentType } from 'react'

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
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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

declare const theme: ThemeFn
export { theme }
