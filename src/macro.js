import { createMacro, MacroError } from 'babel-plugin-macros'
import { resolve, relative, dirname } from 'path'
import { existsSync } from 'fs'
import {
  addImport,
  findIdentifier,
  parseTte,
  replaceWithLocation,
} from './macroHelpers'
import getStyles from './getStyles'
import { resolveTailwindConfig, defaultTailwindConfig } from './tailwindHelpers'

const TW_CONFIG_DEFAULT_FILENAME = 'tailwind.config.js'


const twinMacro = ({ babel: { types: t }, references, state, config }) => {
  const program = state.file.path
  const { configExists, tailwindConfig } = getConfigProperties(state, config)

  state.config = tailwindConfig

  state.tailwindConfigIdentifier = program.scope.generateUidIdentifier(
    'tailwindConfig'
  )
  state.tailwindUtilsIdentifier = program.scope.generateUidIdentifier(
    'tailwindUtils'
  )

  /* eslint-disable-next-line unicorn/prevent-abbreviations */
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    false
  state.isDev = isDev
  state.isProd = !isDev

  // Dev mode coming soon
  if (isDev) {
    state.isDev = false
    state.isProd = true
  }

  const tailwindConfig = configExists
    ? resolveTailwindConfig([require(configPath), defaultTailwindConfig])
    : resolveTailwindConfig([defaultTailwindConfig])
  state.config = tailwindConfig

  if (!tailwindConfig) {
    throw new MacroError(`Couldn’t find the Tailwind config`)
  }

  const styledImport =
    config && config.styled
      ? {
          import: config.styled.import || 'default',
          from: config.styled.from || config.styled,
        }
      : { import: 'default', from: '@emotion/styled' }

  state.existingStyledIdentifier = false
  state.styledIdentifier = findIdentifier({
    program,
    mod: styledImport.from,
    name: styledImport.import,
  })
  if (state.styledIdentifier === null) {
    state.styledIdentifier = program.scope.generateUidIdentifier('styled')
  } else {
    state.existingStyledIdentifier = true
  }

  state.debug = config.debug || false
  state.configExists = configExists

  state.hasSuggestions =
    typeof config.hasSuggestions === 'undefined' ? true : config.hasSuggestions

  program.traverse({
    JSXAttribute(path) {
      if (path.node.name.name !== 'tw') return
      const styles = getStyles(path.node.value.value, t, state)
      const attributes = path
        .findParent(p => p.isJSXOpeningElement())
        .get('attributes')
      const cssAttributes = attributes.filter(
        p => p.node.name && p.node.name.name === 'css'
      )

      if (cssAttributes.length > 0) {
        path.remove()
        const expr = cssAttributes[0].get('value').get('expression')
        if (expr.isArrayExpression()) {
          expr.pushContainer('elements', styles)
        } else {
          expr.replaceWith(t.arrayExpression([expr.node, styles]))
        }
      } else {
        path.replaceWith(
          t.jsxAttribute(
            t.jsxIdentifier('css'),
            t.jsxExpressionContainer(styles)
          )
        )
      }
    },
  })

  references.default.forEach(path => {
    const parent = path.findParent(x => x.isTaggedTemplateExpression())
    if (!parent) return

    const parsed = parseTte({
      path: parent,
      types: t,
      styledIdentifier: state.styledIdentifier,
      state,
    })
    if (!parsed) return

    replaceWithLocation(parsed.path, getStyles(parsed.string, t, state))
  })

  if (state.shouldImportStyled && !state.existingStyledIdentifier) {
    addImport({
      types: t,
      program,
      mod: styledImport.from,
      name: styledImport.import,
      identifier: state.styledIdentifier,
    })
  }

  if (state.isDev) {
  }

  program.scope.crawl()
}

export default createMacro(twinMacro, { configName: 'twin' })
