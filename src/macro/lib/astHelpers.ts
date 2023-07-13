import get from './util/get'
import type {
  T,
  State,
  NodePath,
  CoreContext,
  ImportDeclarationHandler,
} from 'macro/types'

function addImport({
  types: t,
  program,
  mod,
  name,
  identifier,
}: {
  types: typeof T
  program: NodePath<T.Program>
  mod: string
  name: string
  identifier: T.Identifier
}): void {
  const importName =
    name === 'default'
      ? [t.importDefaultSpecifier(identifier)]
      : name
      ? [t.importSpecifier(identifier, t.identifier(name))]
      : []
  program.unshiftContainer(
    'body',
    t.importDeclaration(importName, t.stringLiteral(mod))
  )
}

/**
 * Convert plain js into babel ast
 */
function astify(
  literal: unknown,
  t: typeof T
):
  | T.NullLiteral
  | T.UnaryExpression
  | T.NumericLiteral
  | T.BooleanLiteral
  | T.StringLiteral
  | T.Expression {
  if (literal === null) {
    return t.nullLiteral()
  }

  switch (typeof literal) {
    case 'function': {
      return t.unaryExpression('void', t.numericLiteral(0), true)
    }

    case 'number': {
      return t.numericLiteral(literal)
    }

    case 'boolean': {
      return t.booleanLiteral(literal)
    }

    case 'undefined': {
      return t.unaryExpression('void', t.numericLiteral(0), true)
    }

    case 'string': {
      return t.stringLiteral(literal)
    }

    default: {
      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map(x => astify(x, t)))
      }

      return t.objectExpression(
        objectExpressionElements(literal as Record<string, string>, t)
      )
    }
  }
}

function objectExpressionElements(
  literal: Record<string, string>,
  t: typeof T
): T.ObjectProperty[] {
  return Object.keys(literal)
    .filter(k => typeof literal[k] !== 'undefined')
    .map(
      (k: string): T.ObjectProperty =>
        t.objectProperty(t.stringLiteral(k), astify(literal[k], t))
    )
}

function setStyledIdentifier({
  state,
  path,
  coreContext,
}: ImportDeclarationHandler): void {
  const importFromStitches =
    coreContext.packageUsed.isStitches &&
    coreContext.importConfig.styled.from.includes(path.node.source.value)
  const importFromLibrary =
    path.node.source.value === coreContext.importConfig.styled.from

  if (!importFromLibrary && !importFromStitches) return

  // Look for an existing import that matches the config,
  // if found then reuse it for the rest of the function calls
  path.node.specifiers.some(specifier => {
    if (
      specifier.type === 'ImportDefaultSpecifier' &&
      coreContext.importConfig.styled.import === 'default' &&
      // fixes an issue in gatsby where the styled-components plugin has run
      // before twin. fix is to ignore import aliases which babel creates
      // https://github.com/ben-rogerson/twin.macro/issues/192
      !specifier.local.name.startsWith('_')
    ) {
      state.styledIdentifier = specifier.local
      state.existingStyledIdentifier = true
      return true
    }

    if (
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.type === 'Identifier' &&
      specifier.imported.name === coreContext.importConfig.styled.import
    ) {
      state.styledIdentifier = specifier.local
      state.existingStyledIdentifier = true
      return true
    }

    state.existingStyledIdentifier = false
    return false
  })
}

function setCssIdentifier({
  state,
  path,
  coreContext,
}: ImportDeclarationHandler): void {
  const importFromStitches =
    coreContext.packageUsed.isStitches &&
    coreContext.importConfig.css.from.includes(path.node.source.value)
  const isLibraryImport =
    path.node.source.value === coreContext.importConfig.css.from

  if (!isLibraryImport && !importFromStitches) return

  // Look for an existing import that matches the config,
  // if found then reuse it for the rest of the function calls
  path.node.specifiers.some(specifier => {
    if (
      specifier.type === 'ImportDefaultSpecifier' &&
      coreContext.importConfig.css.import === 'default'
    ) {
      state.cssIdentifier = specifier.local
      state.existingCssIdentifier = true
      return true
    }

    if (
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.type === 'Identifier' &&
      specifier.imported.name === coreContext.importConfig.css.import
    ) {
      state.cssIdentifier = specifier.local
      state.existingCssIdentifier = true
      return true
    }

    state.existingCssIdentifier = false
    return false
  })
}

function getStringFromTTE(path: NodePath<T.TaggedTemplateExpression>): string {
  let getRawValue = false
  let rawValue = ''

  // Convert basic interpolated variables defined in the same file
  const evaluatedValue = (path.get('quasi').evaluate().value as string) ?? ''
  if (evaluatedValue === '') getRawValue = true

  // Evaluating strips escaping, so if there's a square bracket we know it's an
  // arbitrary value/property/variant and should grab the raw value
  if (evaluatedValue.includes('[')) getRawValue = true

  if (getRawValue)
    rawValue = (path.get('quasi.quasis') as Array<NodePath<T.TemplateElement>>)
      .map(q => q.node.value.raw)
      .join('')

  // Trigger error due to non-evaluated value, eg:`w-[${sizes.width}]`
  if (evaluatedValue.length === 0 && rawValue.length > 0) return 'null'

  // Return raw classes with escaping, eg: [content\!]:block
  if (rawValue.length > evaluatedValue.length) return rawValue

  return evaluatedValue
}

// Parse tagged template arrays (``)
function parseTte(
  path: NodePath<T.TaggedTemplateExpression>,
  { t, state }: { t: typeof T; state: State }
): { string: string; path: NodePath<T.TaggedTemplateExpression> } | undefined {
  const cloneNode = t.cloneNode || t.cloneDeep
  const tagType = path.node.tag.type

  if (
    tagType !== 'Identifier' &&
    tagType !== 'MemberExpression' &&
    tagType !== 'CallExpression'
  )
    return

  const string = getStringFromTTE(path)

  // Grab the path location before changing it
  const stringLoc = path.get('quasi').node.loc

  if (tagType === 'CallExpression') {
    replaceWithLocation(
      path.get('tag').get('callee') as NodePath,
      // @ts-expect-error Source type doesn’t include `Identifier` as possible type
      cloneNode(state.styledIdentifier)
    )
    state.isImportingStyled = true
  } else if (tagType === 'MemberExpression') {
    replaceWithLocation(
      path.get('tag').get('object') as NodePath,
      // @ts-expect-error Source type doesn’t include `Identifier` as possible type
      cloneNode(state.styledIdentifier)
    )
    state.isImportingStyled = true
  }

  if (tagType === 'CallExpression' || tagType === 'MemberExpression') {
    replaceWithLocation(
      path,
      t.callExpression(cloneNode(path.node.tag), [
        t.identifier('__twPlaceholder'),
      ]) as unknown as NodePath
    )

    path = (
      path.get('arguments') as Array<NodePath<T.TaggedTemplateExpression>>
    )[0]
  }

  path.node.loc = stringLoc // Restore the original path location

  return { string, path }
}

function replaceWithLocation<EmptyArray>(
  path: NodePath,
  replacement: NodePath | T.Expression | T.ExpressionStatement
): [NodePath] | EmptyArray[] {
  const { loc } = path.node
  const newPaths = replacement ? path.replaceWith(replacement) : []
  if (Array.isArray(newPaths) && newPaths.length > 0) {
    newPaths.forEach(p => {
      p.node.loc = loc
    })
  }

  return newPaths
}

function generateUid(name: string, program: NodePath<T.Program>): T.Identifier {
  return program.scope.generateUidIdentifier(name)
}

function getParentJSX(path: NodePath): NodePath<T.JSXOpeningElement> {
  return path.findParent(p =>
    p.isJSXOpeningElement()
  ) as NodePath<T.JSXOpeningElement>
}

function getAttributeNames(jsxPath: NodePath): string[] {
  const attributes = jsxPath.get('attributes') as Array<
    NodePath<T.JSXAttribute>
  >
  const attributeNames = attributes.map(p => p.node.name?.name) as string[]
  return attributeNames
}

function getCssAttributeData<NodeType extends NodePath>(
  attributes: NodeType[]
): {
  index: number
  hasCssAttribute: boolean
  attribute: NodeType | undefined
} {
  if (!String(attributes))
    return { index: 0, hasCssAttribute: false, attribute: undefined }
  const index = attributes.findIndex(
    attribute =>
      attribute?.isJSXAttribute() &&
      ((attribute.get('name.name') as NodePath).node as unknown as string) ===
        'css'
  )

  return { index, hasCssAttribute: index >= 0, attribute: attributes[index] }
}

function getFunctionValue(
  path: NodePath
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { parent: NodePath; input: any } | undefined {
  if (path.parent.type !== 'CallExpression') return

  const parent = path.findParent(x => x.isCallExpression())
  if (!parent) return

  const argument = (parent.get('arguments') as NodePath[])[0] || ''

  return {
    parent,
    input: argument.evaluate && (argument.evaluate().value as string),
  }
}

function getTaggedTemplateValue<Path extends NodePath>(
  path: Path
): { parent: NodePath<T.TaggedTemplateExpression>; input: string } | undefined {
  if (path.parent.type !== 'TaggedTemplateExpression') return

  const parent = path.findParent(x =>
    x.isTaggedTemplateExpression()
  ) as NodePath<T.TaggedTemplateExpression>
  if (!parent) return

  if (parent.node.tag.type !== 'Identifier') return

  return { parent, input: parent.get('quasi').evaluate().value as string }
}

function getMemberExpression(
  path: NodePath
): { parent: NodePath; input: string } | undefined {
  if (path.parent.type !== 'MemberExpression') return

  const parent = path.findParent(x =>
    x.isMemberExpression()
  ) as NodePath<T.MemberExpression>
  if (!parent) return

  return {
    parent,
    // @ts-expect-error name doesn't exist on node
    input: parent.get('property').node.name as string,
  }
}

function generateTaggedTemplateExpression({
  t,
  identifier,
  styles,
}: {
  t: typeof T
  identifier: T.Identifier
  styles: string | undefined
}): T.TaggedTemplateExpression {
  const backtickStyles = t.templateElement({
    raw: `${styles ?? ''}`,
    cooked: `${styles ?? ''}`,
  })
  const ttExpression = t.taggedTemplateExpression(
    identifier,
    t.templateLiteral([backtickStyles], [])
  )
  return ttExpression
}

function isComponent(name: string): boolean {
  return name.slice(0, 1).toUpperCase() === name.slice(0, 1)
}

const jsxSingleDotError = `The css prop + tw props can only be added to jsx elements with a single dot in their name (or no dot at all).`

function getFirstStyledArgument(
  jsxPath: NodePath<T.JSXOpeningElement>,
  t: typeof T,
  assert: CoreContext['assert']
): T.MemberExpression | T.Identifier | T.StringLiteral {
  const path = get(jsxPath, 'node.name.name') as string

  if (path)
    return isComponent(path) ? t.identifier(path) : t.stringLiteral(path)

  const dotComponent = get(jsxPath, 'node.name') as string
  assert(Boolean(dotComponent), () => jsxSingleDotError)

  // Element name has dots in it
  const objectName = get(dotComponent, 'object.name') as string
  assert(Boolean(objectName), () => jsxSingleDotError)

  const propertyName = get(dotComponent, 'property.name') as string
  assert(Boolean(propertyName), () => jsxSingleDotError)

  return t.memberExpression(
    t.identifier(objectName),
    t.identifier(propertyName)
  )
}

type MakeStyledComponent = {
  t: typeof T
  secondArg: T.Expression | T.StringLiteral | T.Identifier
  jsxPath: NodePath<T.JSXOpeningElement>
  program: NodePath<T.Program>
  state: State
  coreContext: CoreContext
  fromProp: 'tw' | 'css'
}

type CreateStyledProps = Pick<
  MakeStyledComponent,
  'jsxPath' | 't' | 'secondArg'
> & {
  stateStyled: T.Identifier
  constName: T.Identifier
  firstArg: T.MemberExpression | T.Identifier | T.StringLiteral
}

function createStyledPropsForTw({
  t,
  stateStyled,
  firstArg,
  secondArg,
  constName,
}: CreateStyledProps): T.VariableDeclaration {
  const identifier = t.callExpression(stateStyled, [firstArg])
  const styledProps = [
    t.variableDeclarator(constName, t.callExpression(identifier, [secondArg])),
  ]
  return t.variableDeclaration('const', styledProps)
}

function createStyledPropsForCss(
  args: CreateStyledProps
): T.VariableDeclaration | undefined {
  const cssPropAttribute = args.jsxPath
    .get('attributes')
    .find(
      p =>
        p.isJSXAttribute() &&
        p.get('name').isJSXIdentifier() &&
        p.get('name')?.node.name === 'css'
    )

  const cssPropValue = cssPropAttribute?.get(
    'value'
  ) as NodePath<T.JSXExpressionContainer>

  const expression = cssPropValue?.node?.expression
  if (!expression || expression.type === 'JSXEmptyExpression') return

  args.jsxPath.node.attributes = args.jsxPath.node.attributes.filter(
    p => p === cssPropAttribute?.node
  )

  return createStyledPropsForTw({ ...args, secondArg: expression })
}

function makeStyledComponent({
  t,
  secondArg,
  jsxPath,
  program,
  state,
  coreContext,
  fromProp,
}: MakeStyledComponent): void {
  const constName = program.scope.generateUidIdentifier('TwComponent')

  if (!state.styledIdentifier) {
    state.styledIdentifier = generateUid('styled', program)
    state.isImportingStyled = true
  }

  const firstArg = getFirstStyledArgument(jsxPath, t, coreContext.assert)
  let styledDefinition = null
  const stateStyled: T.Identifier = state.styledIdentifier

  if (coreContext.packageUsed.isSolid) {
    const params = { jsxPath, t, stateStyled, firstArg, secondArg, constName }
    styledDefinition =
      fromProp === 'tw'
        ? createStyledPropsForTw(params)
        : createStyledPropsForCss(params)
  } else {
    const args = [firstArg, secondArg].filter(Boolean)
    const identifier = t.callExpression(stateStyled, args)
    const styledProps = [t.variableDeclarator(constName, identifier)]
    styledDefinition = t.variableDeclaration('const', styledProps)
  }

  if (!styledDefinition) return

  const rootParentPath = jsxPath.findParent(p =>
    p.parentPath ? p.parentPath.isProgram() : false
  ) as NodePath<T.Program>
  if (rootParentPath) rootParentPath.insertBefore(styledDefinition)

  if (t.isMemberExpression(firstArg)) {
    // Replace components with a dot, eg: Dialog.blah
    const id = t.jsxIdentifier(constName.name)
    jsxPath.get('name').replaceWith(id)
    if (jsxPath.node.selfClosing) return
    ;(jsxPath.parentPath.get('closingElement.name') as NodePath).replaceWith(id)
  } else {
    ;(jsxPath.node.name as T.JSXIdentifier).name = constName.name
    if (jsxPath.node.selfClosing) return
    // @ts-expect-error Untyped name replacement
    jsxPath.parentPath.node.closingElement.name.name = constName.name
  }
}

function getJsxAttributes(
  path: NodePath<T.JSXElement>
): Array<NodePath<T.JSXAttribute>> {
  const attributes = path.get('openingElement.attributes') as Array<
    NodePath<T.JSXAttribute>
  >
  return attributes.filter(a => a.isJSXAttribute())
}

export {
  addImport,
  astify,
  parseTte,
  replaceWithLocation,
  setStyledIdentifier,
  setCssIdentifier,
  generateUid,
  getParentJSX,
  getAttributeNames,
  getCssAttributeData,
  getFunctionValue,
  getTaggedTemplateValue,
  getMemberExpression,
  generateTaggedTemplateExpression,
  makeStyledComponent,
  getJsxAttributes,
}
