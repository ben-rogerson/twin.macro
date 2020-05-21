/* eslint-disable-next-line import/no-unassigned-import */
import 'react'

// TODO: check if emotionStyled / styledComponents is sensible? I doubt it!
import emotionStyled from '@emotion/styled'
import { css as emotionCss } from '@emotion/core'
import styledComponents, { css as styledCss } from 'styled-components'

export declare const styled: typeof emotionStyled & typeof styledComponents
export declare const css: typeof emotionCss & typeof styledCss

export interface TwStyle {
  [key: string]: string | number | TwStyle
}

export type TemplateFn<R> = (
  strings: Readonly<TemplateStringsArray>,
  ...values: readonly string[]
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
