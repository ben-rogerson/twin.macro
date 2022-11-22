import {
  replaceWithLocation,
  astify,
  getFunctionValue,
  getTaggedTemplateValue,
  getMemberExpression,
} from './lib/astHelpers'
import type {
  AdditionalHandlerParameters,
  T,
  NodePath,
  CoreContext,
} from './types'

type GetDirectReplacement = Pick<
  HandleDefinition,
  'mediaQuery' | 'parent' | 't'
>
function getDirectReplacement({
  mediaQuery,
  parent,
  t,
}: GetDirectReplacement): Expression {
  return {
    newPath: parent,
    replacement: astify(mediaQuery, t),
  }
}

type Expression = {
  newPath: NodePath
  replacement: T.TemplateLiteral | T.ObjectExpression | T.Expression
}

type HandleDefinition = {
  mediaQuery: string
  parent: NodePath
  type: string
  t: typeof T
}

function handleDefinition({
  mediaQuery,
  parent,
  type,
  t,
}: HandleDefinition): undefined | (() => Expression) {
  return {
    TaggedTemplateExpression(): {
      newPath: NodePath
      replacement: T.TemplateLiteral
    } {
      const newPath = parent.findParent(x =>
        x.isTaggedTemplateExpression()
      ) as NodePath<T.TaggedTemplateExpression>
      const query = [`${mediaQuery} { `, ` }`]
      const quasis = [
        t.templateElement({ raw: query[0], cooked: query[0] }, false),
        t.templateElement({ raw: query[1], cooked: query[1] }, true),
      ]
      const expressions = [newPath.get('quasi').node]
      const replacement = t.templateLiteral(quasis, expressions)
      return { newPath, replacement }
    },
    CallExpression(): { newPath: NodePath; replacement: T.ObjectExpression } {
      const newPath = parent.findParent(x =>
        x.isCallExpression()
      ) as NodePath<T.CallExpression>
      const value = newPath.get('arguments')[0].node as T.Expression
      const replacement = t.objectExpression([
        t.objectProperty(t.stringLiteral(mediaQuery), value),
      ])
      return { newPath, replacement }
    },
    ObjectProperty(): Expression {
      // Remove brackets around keys so merges work with tailwind screens
      // styled.div({ [screen`2xl`]: tw`block`, ...tw`2xl:inline` })
      // https://github.com/ben-rogerson/twin.macro/issues/379
      // @ts-expect-error unsure of parent type
      parent.parent.computed = false

      return getDirectReplacement({ mediaQuery, parent, t })
    },
    ExpressionStatement: () => getDirectReplacement({ mediaQuery, parent, t }),
    ArrowFunctionExpression: () =>
      getDirectReplacement({ mediaQuery, parent, t }),
    ArrayExpression: () => getDirectReplacement({ mediaQuery, parent, t }),
    BinaryExpression: () => getDirectReplacement({ mediaQuery, parent, t }),
    LogicalExpression: () => getDirectReplacement({ mediaQuery, parent, t }),
    ConditionalExpression: () =>
      getDirectReplacement({ mediaQuery, parent, t }),
    VariableDeclarator: () => getDirectReplacement({ mediaQuery, parent, t }),
    TemplateLiteral: () => getDirectReplacement({ mediaQuery, parent, t }),
    TSAsExpression: () => getDirectReplacement({ mediaQuery, parent, t }),
  }[type]
}

function getMediaQuery({
  input,
  screens,
  assert,
}: {
  input: string | string[]
  screens: Record<
    string,
    | string
    | { raw?: string; min?: string; max?: string }
    | Array<{ raw?: string; min?: string; max?: string }>
  >
  assert: CoreContext['assert']
}): string {
  const _input =
    typeof input === 'string' ? input.split(',').map(s => s.trim()) : input

  const _screens = _input.map(s => screens[s])

  _input.forEach(i => {
    assert(
      Boolean(screens[i]),
      ({ color }) =>
        `${color(
          `${
            input
              ? `✕ ${color(i, 'errorLight')} wasn’t found in your`
              : 'Specify a screen value from your'
          } tailwind config`
        )}\n\nTry one of these values:\n\n${Object.entries(screens)
          .map(
            ([k, v]) =>
              `${color('-', 'subdued')} screen(${color(
                `'${k}'`,
                'success'
              )})({ ... }) (${String(v)})`
          )
          .join('\n')}`
    )
  })

  const mediaQuery = _screens
    .map(screen => {
      if (typeof screen === 'string') {
        return '(min-width: ' + screen + ')'
      }

      if (!Array.isArray(screen) && typeof screen.raw === 'string') {
        return screen.raw
      }

      return (Array.isArray(screen) ? screen : [screen])
        .map(range =>
          [
            typeof range.min === 'string' ? `(min-width: ${range.min} )` : null,
            typeof range.max === 'string' ? `(max-width: ${range.max}) ` : null,
          ]
            .filter(Boolean)
            .join(' and ')
        )
        .join(', ')
    })
    .join(', ')

  return mediaQuery ? '@media ' + mediaQuery : ''
}

function handleScreenFunction({
  references,
  t,
  coreContext,
}: AdditionalHandlerParameters): void {
  if (!references.screen) return

  const screens = coreContext.theme('screens') as Record<string, string>

  references.screen.forEach(path => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { input, parent } = getTaggedTemplateValue(path) ?? // screen.lg``
      getFunctionValue(path) ?? // screen.lg({ })
      getMemberExpression(path) ?? {
        // screen`lg`
        input: null,
        parent: null,
      }

    const definition = handleDefinition({
      type: (parent as NodePath).parent.type,
      mediaQuery: getMediaQuery({
        input: input as string,
        screens,
        assert: coreContext.assert,
      }),
      parent: parent as NodePath,
      t,
    })

    coreContext.assert(
      Boolean(definition),
      ({ color }) =>
        `${color(
          `✕ The screen import doesn’t support that syntax`
        )}\n\nTry using it like this: ${color(
          [Object.keys(screens)[0]].map(f => `screen("${f}")`).join(''),
          'success'
        )}`
    )

    const { newPath, replacement } = (definition as () => Expression)()

    replaceWithLocation(newPath, replacement)
  })
}

export { handleScreenFunction }
