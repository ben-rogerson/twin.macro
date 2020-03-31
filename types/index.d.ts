import * as CSS from 'csstype'
import 'react'

// "borrowed" from styled components types
// this seems to work with emotion and SC so we'll use this
export type CSSProperties = CSS.Properties<string | number>

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject }

export interface CSSObject extends CSSProperties, CSSPseudos {
  [key: string]: CSSObject | string | number | undefined
}

export type TwFn = (
  strings: TemplateStringsArray,
  ...values: never[]
) => CSSObject

declare const tw: TwFn & Record<keyof JSX.IntrinsicElements, TwFn>
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
