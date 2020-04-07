import { createMacro, MacroError } from 'babel-plugin-macros'
import { resolve, relative, dirname } from 'path'
import { existsSync } from 'fs'
import {
  addImport,
  findIdentifier,
  parseTte,
  replaceWithLocation
} from './macroHelpers'
import getStyles from './getStyles'
import { resolveTailwindConfig, defaultTailwindConfig } from './tailwindHelpers'

// const UTILS_IMPORT_FILEPATH = 'twin.macro/utils.umd'
const TW_CONFIG_DEFAULT_FILENAME = 'tailwind.config.js'

export default createMacro(twinMacro, { configName: 'twin' })

function twinMacro({ babel: { types: t }, references, state, config }) {
  const sourceRoot = state.file.opts.sourceRoot || '.'
  const program = state.file.path
  const configFile = config && config.config
  const configPath = resolve(
    sourceRoot,
    configFile || `./${TW_CONFIG_DEFAULT_FILENAME}`
  )
  const configExists = existsSync(configPath)

  state.tailwindConfigIdentifier = program.scope.generateUidIdentifier(
    'tailwindConfig'
  )
  state.tailwindUtilsIdentifier = program.scope.generateUidIdentifier(
    'tailwindUtils'
  )

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
          from: config.styled.from || config.styled
        }
      : { import: 'default', from: '@emotion/styled' }

  // state.existingStyledIdentifier =
  //   state.styledIdentifier === null ? false : true
  // state.styledIdentifier = findIdentifier({
  //   program,
  //   mod: styledImport.from,
  //   name: styledImport.import
  // })

  // if (!state.existingStyledIdentifier) {
  //   state.styledIdentifier = program.scope.generateUidIdentifier('styled')
  // }

  state.existingStyledIdentifier = false
  state.styledIdentifier = findIdentifier({
    program,
    mod: styledImport.from,
    name: styledImport.import
  })
  if (state.styledIdentifier === null) {
    state.styledIdentifier = program.scope.generateUidIdentifier('styled')
  } else {
    state.existingStyledIdentifier = true
  }

  state.debug = config.debug || false
  state.configExists = configExists

  // TODO: Disable suggestions in prod
  state.hasSuggestions =
    typeof config.hasSuggestions === 'undefined' ? true : config.hasSuggestions

  program.traverse({
    JSXAttribute(path) {
      if (path.node.name.name !== 'tw') return
      const styles = getStyles(path.node.value.value, t, state)
      const attrs = path
        .findParent(p => p.isJSXOpeningElement())
        .get('attributes')
      const cssAttr = attrs.filter(
        p => p.node.name && p.node.name.name === 'css'
      )

      if (cssAttr.length) {
        path.remove()
        const expr = cssAttr[0].get('value').get('expression')
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
    }
  })

  references.default.forEach(path => {
    const parent = path.findParent(x => x.isTaggedTemplateExpression())
    if (!parent) return

    const parsed = parseTte({
      path: parent,
      types: t,
      styledIdentifier: state.styledIdentifier,
      state
    })
    if (!parsed) return

    replaceWithLocation(parsed.path, getStyles(parsed.str, t, state))
  })

  if (state.shouldImportStyled && !state.existingStyledIdentifier) {
    addImport({
      types: t,
      program,
      mod: styledImport.from,
      name: styledImport.import,
      identifier: state.styledIdentifier
    })
  }

  // if (state.shouldImportConfig) {
  //   const configImportPath =
  //     './' + relative(dirname(state.file.opts.filename), configPath)
  //   const originalConfigIdentifier = program.scope.generateUidIdentifier(
  //     'tailwindConfig'
  //   )

  //   program.unshiftContainer(
  //     'body',
  //     t.variableDeclaration('const', [
  //       t.variableDeclarator(
  //         state.tailwindConfigIdentifier,
  //         t.callExpression(
  //           t.memberExpression(
  //             state.tailwindUtilsIdentifier,
  //             t.identifier('resolveTailwindConfig')
  //           ),
  //           [configExists ? originalConfigIdentifier : t.objectExpression([])]
  //         )
  //       )
  //     ])
  //   )
  //   if (configExists) {
  //     program.unshiftContainer(
  //       'body',
  //       t.importDeclaration(
  //         [t.importDefaultSpecifier(originalConfigIdentifier)],
  //         t.stringLiteral(configImportPath)
  //       )
  //     )
  //   }
  //   // Add the utils import
  //   program.unshiftContainer(
  //     'body',
  //     t.importDeclaration(
  //       [t.importDefaultSpecifier(state.tailwindUtilsIdentifier)],
  //       t.stringLiteral(UTILS_IMPORT_FILEPATH)
  //     )
  //   )
  // }

  program.scope.crawl()
}
