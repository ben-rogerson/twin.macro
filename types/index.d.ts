import 'react'

export interface TwStyle {
  [key: string]: string | number | TwStyle
}

export type TemplateFn<R> = (
  strings: TemplateStringsArray,
  ...values: never[]
) => R

export type TwFn = TemplateFn<TwStyle>

export type TwComponent<K extends keyof JSX.IntrinsicElements> = (
  props: JSX.IntrinsicElements[K]
) => JSX.Element

export type TwComponentMap = {
  [K in keyof JSX.IntrinsicElements]: TemplateFn<TwComponent<K>>
}

declare const tw: TwFn & TwComponentMap
export default tw

declare module 'react' {
  interface DOMAttributes<T> {
    tw?: string
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      tw?: string
    }
  }
}
