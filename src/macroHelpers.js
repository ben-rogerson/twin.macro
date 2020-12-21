import babylon from '@babel/parser'
import { throwIf } from './utils'
import { logGeneralError } from './logging'

const SPREAD_ID = '__spread__'
const COMPUTED_ID = '__computed__'

function addImport({ types: t, program, mod, name, identifier }) {
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

function assignify(objectAst, t) {
  if (objectAst.type !== 'ObjectExpression') return objectAst

  const cloneNode = t.cloneNode || t.cloneDeep
  const currentChunk = []
  const chunks = []

  objectAst.properties.forEach(property => {
    if (property.type === 'SpreadElement') {
      if (currentChunk.length > 0) {
        chunks.push(cloneNode(t.objectExpression(currentChunk)))
        currentChunk.length = 0
      }

      chunks.push(cloneNode(property.argument))
    } else {
      property.value = assignify(property.value, t)
      currentChunk.push(property)
    }
  })

  if (chunks.length === 0) return objectAst

  if (currentChunk.length > 0) {
    chunks.push(cloneNode(t.objectExpression(currentChunk)))
  }

  return t.callExpression(
    t.memberExpression(t.identifier('Object'), t.identifier('assign')),
    chunks
  )
}

function objectExpressionElements(literal, t, spreadType) {
  return Object.keys(literal)
    .filter(k => {
      return typeof literal[k] !== 'undefined'
    })
    .map(k => {
      if (k.startsWith(SPREAD_ID)) {
        return t[spreadType](babylon.parseExpression(literal[k]))
      }

      const computed = k.startsWith(COMPUTED_ID)
      const key = computed
        ? babylon.parseExpression(k.slice(12))
        : t.stringLiteral(k)
      return t.objectProperty(key, astify(literal[k], t), computed)
    })
}

/**
 * Convert plain js into babel ast
 */
function astify(literal, t) {
  if (literal === null) {
    return t.nullLiteral()
  }

  switch (typeof literal) {
    case 'function':
      return t.unaryExpression('void', t.numericLiteral(0), true)
    case 'number':
      return t.numericLiteral(literal)
    case 'boolean':
      return t.booleanLiteral(literal)
    case 'undefined':
      return t.unaryExpression('void', t.numericLiteral(0), true)
    case 'string':
      if (literal.startsWith(COMPUTED_ID)) {
        return babylon.parseExpression(literal.slice(COMPUTED_ID.length))
      }

      return t.stringLiteral(literal)
    default:
      // Assuming literal is an object

      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map(x => astify(x, t)))
      }

      try {
        return t.objectExpression(
          objectExpressionElements(literal, t, 'spreadElement')
        )
      } catch (_) {
        return t.objectExpression(
          objectExpressionElements(literal, t, 'spreadProperty')
        )
      }
  }
}

const setStyledIdentifier = ({ state, path, styledImport }) => {
  if (path.node.source.value !== styledImport.from) return

  // Look for an existing import that matches the config,
  // if found then reuse it for the rest of the function calls
  path.node.specifiers.some(specifier => {
    if (
      specifier.type === 'ImportDefaultSpecifier' &&
      styledImport.import === 'default' &&
      // fixes an issue in gatsby where the styled-components plugin has run
      // before twin. fix is to ignore import aliases which babel creates
      // https://github.com/ben-rogerson/twin.macro/issues/192
      !specifier.local.name.startsWith('_')
    ) {
      state.styledIdentifier = specifier.local
      return true
    }

    if (specifier.imported && specifier.imported.name === styledImport.import) {
      state.styledIdentifier = specifier.local
      return true
    }

    return false
  })
}

const setCssIdentifier = ({ state, path, cssImport }) => {
  if (path.node.source.value !== cssImport.from) return

  // Look for an existing import that matches the config,
  // if found then reuse it for the rest of the function calls
  path.node.specifiers.some(specifier => {
    if (
      specifier.type === 'ImportDefaultSpecifier' &&
      cssImport.import === 'default'
    ) {
      state.cssIdentifier = specifier.local
      return true
    }

    if (specifier.imported && specifier.imported.name === cssImport.import) {
      state.cssIdentifier = specifier.local
      return true
    }

    return false
  })
}

/**
 * Parse tagged template arrays (``)
 */
function parseTte({ path, types: t, styledIdentifier, state }) {
  const cloneNode = t.cloneNode || t.cloneDeep
  const tagType = path.node.tag.type

  if (
    tagType !== 'Identifier' &&
    tagType !== 'MemberExpression' &&
    tagType !== 'CallExpression'
  )
    return null

  // Convert *very* basic interpolated variables
  const string = path.get('quasi').evaluate().value
  // Grab the path location before changing it
  const stringLoc = path.get('quasi').node.loc

  if (tagType === 'CallExpression') {
    replaceWithLocation(
      path.get('tag').get('callee'),
      cloneNode(styledIdentifier)
    )
    state.shouldImportStyled = true
  } else if (tagType === 'MemberExpression') {
    replaceWithLocation(
      path.get('tag').get('object'),
      cloneNode(styledIdentifier)
    )
    state.shouldImportStyled = true
  }

  if (tagType === 'CallExpression' || tagType === 'MemberExpression') {
    replaceWithLocation(
      path,
      t.callExpression(cloneNode(path.node.tag), [
        t.identifier('__twPlaceholder'),
      ])
    )

    path = path.get('arguments')[0]
  }

  // Restore the original path location
  path.node.loc = stringLoc

  return { string, path }
}

function replaceWithLocation(path, replacement) {
  const { loc } = path.node
  const newPaths = replacement ? path.replaceWith(replacement) : []
  if (Array.isArray(newPaths) && newPaths.length > 0) {
    newPaths.forEach(p => {
      p.node.loc = loc
    })
  }

  return newPaths
}

const validImports = new Set([
  'default',
  'styled',
  'css',
  'theme',
  'TwStyle',
  'ThemeStyle',
  'GlobalStyles',
])
const validateImports = imports => {
  const unsupportedImport = Object.keys(imports).find(
    reference => !validImports.has(reference)
  )
  const importTwAsNamedNotDefault = Object.keys(imports).find(
    reference => reference === 'tw'
  )
  throwIf(importTwAsNamedNotDefault, () => {
    logGeneralError(
      `Please use the default export for twin.macro, i.e:\nimport tw from 'twin.macro'\nNOT import { tw } from 'twin.macro'`
    )
  })
  throwIf(unsupportedImport, () =>
    logGeneralError(
      `Twin doesn't recognize { ${unsupportedImport} }\n\nTry one of these imports:\nimport tw, { styled, css, theme } from 'twin.macro'`
    )
  )
}

const generateUid = (name, program) => program.scope.generateUidIdentifier(name)

export {
  SPREAD_ID,
  COMPUTED_ID,
  addImport,
  assignify,
  astify,
  parseTte,
  replaceWithLocation,
  validateImports,
  setStyledIdentifier,
  setCssIdentifier,
  generateUid,
}
