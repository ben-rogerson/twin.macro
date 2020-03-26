import { CSSObject } from '@emotion/serialize'
import 'react'

type TwFn = (strings: TemplateStringsArray, ...values: never[]) => CSSObject

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
