import {
  replaceWithLocation,
  astify,
  getFunctionValue,
  getTaggedTemplateValue,
  getMemberExpression,
} from './../macroHelpers'
import { getTheme, throwIf } from './../utils'
import { logBadGood } from './../logging'

const getDirectReplacement = ({ mediaQuery, parent, t }) => ({
  newPath: parent,
  replacement: astify(mediaQuery, t),
})

const handleDefinition = ({ mediaQuery, parent, type, t }) =>
  ({
    TaggedTemplateExpression() {
      const newPath = parent.findParent(x => x.isTaggedTemplateExpression())
      const query = [`${mediaQuery} { `, ` }`]
      const quasis = [
        t.templateElement({ raw: query[0], cooked: query[0] }, false),
        t.templateElement({ raw: query[1], cooked: query[1] }, true),
      ]
      const expressions = [newPath.get('quasi').node]
      const replacement = t.templateLiteral(quasis, expressions)
      return { newPath, replacement }
    },
    CallExpression() {
      const newPath = parent.findParent(x => x.isCallExpression())
      const value = newPath.get('arguments')[0].node
      const replacement = t.objectExpression([
        t.objectProperty(t.stringLiteral(mediaQuery), value),
      ])
      return { newPath, replacement }
    },
    ObjectProperty() {
      // Remove brackets around keys so merges work with tailwind screens
      // styled.div({ [screen`2xl`]: tw`block`, ...tw`2xl:inline` })
      // https://github.com/ben-rogerson/twin.macro/issues/379
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
  }[type])

const validateScreenValue = ({ screen, screens, value }) =>
  throwIf(!screen, () =>
    logBadGood(
      `${
        value
          ? `“${value}” wasn’t found in your`
          : 'Specify a screen value from your'
      } tailwind config`,
      `Try one of these:\n\n${Object.entries(screens)
        .map(([k, v]) => `screen.${k}\`...\` (${v})`)
        .join('\n')}`
    )
  )

const getMediaQuery = ({ input, screens }) => {
  validateScreenValue({ screen: screens[input], screens, value: input })
  const mediaQuery = `@media (min-width: ${screens[input]})`
  return mediaQuery
}

const handleScreenFunction = ({ references, t, state }) => {
  if (!references.screen) return

  const theme = getTheme(state.config.theme)
  const screens = theme('screens')

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
  references.screen.forEach(path => {
    const { input, parent } = getTaggedTemplateValue(path) || // screen.lg``
      getFunctionValue(path) || // screen.lg({ })
      getMemberExpression(path) || {
        // screen`lg`
        input: null,
        parent: null,
      }

    const definition = handleDefinition({
      type: parent.parent.type,
      mediaQuery: getMediaQuery({ input, screens }),
      parent,
      t,
    })

    throwIf(!definition, () =>
      logBadGood(
        `The screen import doesn’t support that syntax`,
        `Try something like this:\n\n${[...Object.keys(screens)]
          .map(f => `screen.${f}`)
          .join(', ')}`
      )
    )

    const { newPath, replacement } = definition()

    replaceWithLocation(newPath, replacement)
  })
}

export { handleScreenFunction }
