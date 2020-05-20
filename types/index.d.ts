/* eslint-disable-next-line import/no-unassigned-import */
import 'react'

export interface TwStyle {
  [key: string]: string | number | TwStyle
}

export type TemplateFn<R> = (
  /* eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types */
  strings: TemplateStringsArray,
  /* eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types */
  ...values: string[]
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
