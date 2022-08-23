import type { NodePath, types as T } from '@babel/core'
import type { MacroParams } from 'babel-plugin-macros'
import type { CoreContext, CssObject } from '../../core/types'

type Identifiers = {
  styledIdentifier: T.Identifier | undefined
  cssIdentifier: T.Identifier | undefined
}

type StateBase = {
  babel: MacroParams['babel']
  config: MacroParams['config']
  existingCssIdentifier?: boolean
  existingStyledIdentifier?: boolean
  hasCssAttribute: boolean
  hasTwAttribute?: boolean
  isDev: boolean
  isImportingStyled?: boolean
  isImportingCss?: boolean
  tailwindConfigIdentifier: T.Identifier
  tailwindUtilsIdentifier: T.Identifier
}

export type State = StateBase & Identifiers

export type HandlerParameters = {
  t: typeof T
  state: State
  program: NodePath<T.Program>
  coreContext: CoreContext
}

export type AddDataPropToExistingPath = {
  path: NodePath
  attributes: Array<NodePath<T.JSXAttribute | T.JSXSpreadAttribute>>
  rawClasses: string
  propName?: string
} & Pick<HandlerParameters, 't' | 'state' | 'coreContext'>

export type JSXAttributeHandler = HandlerParameters & {
  path: NodePath<T.JSXAttribute>
}
export type ImportDeclarationHandler = HandlerParameters & {
  path: NodePath<T.ImportDeclaration>
}

export type AdditionalHandlerParameters = {
  t: typeof T
  references: MacroParams['references']
  state: StateBase & {
    styledIdentifier: T.Identifier
    cssIdentifier: T.Identifier
  }
  program: NodePath<T.Program>
  coreContext: CoreContext
}

export type { NodePath, CoreContext, T, MacroParams, CssObject }
