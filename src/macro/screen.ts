import {
  replaceWithLocation,
  astify,
  getFunctionValue,
  getTaggedTemplateValue,
  getMemberExpression,
} from './lib/astHelpers'
import throwIf from './lib/util/throwIf'
import { logBadGood } from './lib/logging'
import type { AdditionalHandlerParameters, T, NodePath } from './types'
import type { Config } from 'tailwindcss'

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

function validateScreenValue({
  screen,
  screens,
  value,
}: {
  screen: string
  screens: Config['screens']
  value: string
}): void {
  throwIf(!screen, () =>
    logBadGood(
      `${
        value
          ? `“${value}” wasn’t found in your`
          : 'Specify a screen value from your'
      } tailwind config`,
      `Try one of these:\n\n${Object.entries(screens)
        .map(([k, v]) => `screen.${k}\`...\` (${String(v)})`)
        .join('\n')}`
    )
  )
}

function getMediaQuery({
  input,
  screens,
}: {
  input: string
  screens: Record<string, string>
}): string {
  validateScreenValue({ screen: screens[input], screens, value: input })
  const mediaQuery = `@media (min-width: ${String(screens[input])})`
  return mediaQuery
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
      mediaQuery: getMediaQuery({ input: input as string, screens }),
      parent: parent as NodePath,
      t,
    })

    if (!definition) {
      throwIf(true, () =>
        logBadGood(
          `The screen import doesn’t support that syntax`,
          `Try something like this:\n\n${[...Object.keys(screens)]
            .map(f => `screen.${f}`)
            .join(', ')}`
        )
      )
      return
    }

    const { newPath, replacement } = definition()

    replaceWithLocation(newPath, replacement)
  })
}

export { handleScreenFunction }
