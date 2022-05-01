import babylon from '@babel/parser'
import { throwIf, get } from './utils'
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

  // FIXME: Remove comment and fix next line
  // eslint-disable-next-line unicorn/no-array-for-each
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
    .filter(k => typeof literal[k] !== 'undefined')
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
  const importFromStitches =
    state.isStitches && styledImport.from.includes(path.node.source.value)
  const importFromLibrary = path.node.source.value === styledImport.from

  if (!importFromLibrary && !importFromStitches) return

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
      state.existingStyledIdentifier = true
      return true
    }

    if (specifier.imported && specifier.imported.name === styledImport.import) {
      state.styledIdentifier = specifier.local
      state.existingStyledIdentifier = true
      return true
    }

    state.existingStyledIdentifier = false
    return false
  })
}

const setCssIdentifier = ({ state, path, cssImport }) => {
  const importFromStitches =
    state.isStitches && cssImport.from.includes(path.node.source.value)
  const isLibraryImport = path.node.source.value === cssImport.from

  if (!isLibraryImport && !importFromStitches) return

  // Look for an existing import that matches the config,
  // if found then reuse it for the rest of the function calls
  path.node.specifiers.some(specifier => {
    if (
      specifier.type === 'ImportDefaultSpecifier' &&
      cssImport.import === 'default'
    ) {
      state.cssIdentifier = specifier.local
      state.existingCssIdentifier = true
      return true
    }

    if (specifier.imported && specifier.imported.name === cssImport.import) {
      state.cssIdentifier = specifier.local
      state.existingCssIdentifier = true
      return true
    }

    state.existingCssIdentifier = false
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
    state.isImportingStyled = true
  } else if (tagType === 'MemberExpression') {
    replaceWithLocation(
      path.get('tag').get('object'),
      cloneNode(styledIdentifier)
    )
    state.isImportingStyled = true
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
    // FIXME: Remove comment and fix next line
    // eslint-disable-next-line unicorn/no-array-for-each
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
  'screen',
  'TwStyle',
  'TwComponent',
  'ThemeStyle',
  'GlobalStyles',
  'globalStyles',
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
      `Twin doesn't recognize { ${unsupportedImport} }\n\nTry one of these imports:\nimport tw, { styled, css, theme, screen, GlobalStyles, globalStyles } from 'twin.macro'`
    )
  )
}

const generateUid = (name, program) => program.scope.generateUidIdentifier(name)

const getParentJSX = path => path.findParent(p => p.isJSXOpeningElement())

const getAttributeNames = jsxPath => {
  const attributes = jsxPath.get('attributes')
  const attributeNames = attributes.map(p => p.node.name && p.node.name.name)
  return attributeNames
}

const getCssAttributeData = attributes => {
  if (!String(attributes)) return {}
  const index = attributes.findIndex(
    attribute =>
      attribute.isJSXAttribute() && attribute.get('name.name').node === 'css'
  )

  return { index, hasCssAttribute: index >= 0, attribute: attributes[index] }
}

const getFunctionValue = path => {
  if (path.parent.type !== 'CallExpression') return

  const parent = path.findParent(x => x.isCallExpression())
  if (!parent) return

  const argument = parent.get('arguments')[0] || ''

  return {
    parent,
    input: argument.evaluate && argument.evaluate().value,
  }
}

const getTaggedTemplateValue = path => {
  if (path.parent.type !== 'TaggedTemplateExpression') return

  const parent = path.findParent(x => x.isTaggedTemplateExpression())
  if (!parent) return
  if (parent.node.tag.type !== 'Identifier') return

  return { parent, input: parent.get('quasi').evaluate().value }
}

const getMemberExpression = path => {
  if (path.parent.type !== 'MemberExpression') return

  const parent = path.findParent(x => x.isMemberExpression())
  if (!parent) return

  return { parent, input: parent.get('property').node.name }
}

const generateTaggedTemplateExpression = ({ identifier, t, styles }) => {
  const backtickStyles = t.templateElement({
    raw: `${styles}`,
    cooked: `${styles}`,
  })
  const ttExpression = t.taggedTemplateExpression(
    identifier,
    t.templateLiteral([backtickStyles], [])
  )
  return ttExpression
}

const isComponent = name => name.slice(0, 1).toUpperCase() === name.slice(0, 1)

const jsxElementNameError = () =>
  logGeneralError(
    `The css prop + tw props can only be added to jsx elements with a single dot in their name (or no dot at all).`
  )

const getFirstStyledArgument = (jsxPath, t) => {
  const path = get(jsxPath, 'node.name.name')

  if (path)
    return isComponent(path) ? t.identifier(path) : t.stringLiteral(path)

  const dotComponent = get(jsxPath, 'node.name')
  throwIf(!dotComponent, jsxElementNameError)

  // Element name has dots in it
  const objectName = get(dotComponent, 'object.name')
  throwIf(!objectName, jsxElementNameError)

  const propertyName = get(dotComponent, 'property.name')
  throwIf(!propertyName, jsxElementNameError)

  return t.memberExpression(
    t.identifier(objectName),
    t.identifier(propertyName)
  )
}

const makeStyledComponent = ({ secondArg, jsxPath, t, program, state }) => {
  const constName = program.scope.generateUidIdentifier('TwComponent')

  if (!state.styledIdentifier) {
    state.styledIdentifier = generateUid('styled', program)
    state.isImportingStyled = true
  }

  const firstArg = getFirstStyledArgument(jsxPath, t)

  const args = [firstArg, secondArg].filter(Boolean)
  const identifier = t.callExpression(state.styledIdentifier, args)
  const styledProps = [t.variableDeclarator(constName, identifier)]
  const styledDefinition = t.variableDeclaration('const', styledProps)

  const rootParentPath = jsxPath.findParent(p => p.parentPath.isProgram())
  rootParentPath.insertBefore(styledDefinition)

  if (t.isMemberExpression(firstArg)) {
    // Replace components with a dot, eg: Dialog.blah
    const id = t.jsxIdentifier(constName.name)
    jsxPath.get('name').replaceWith(id)
    if (jsxPath.node.selfClosing) return
    jsxPath.parentPath.get('closingElement.name').replaceWith(id)
  } else {
    jsxPath.node.name.name = constName.name
    if (jsxPath.node.selfClosing) return
    jsxPath.parentPath.node.closingElement.name.name = constName.name
  }
}

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
  getParentJSX,
  getAttributeNames,
  getCssAttributeData,
  getFunctionValue,
  getTaggedTemplateValue,
  getMemberExpression,
  generateTaggedTemplateExpression,
  makeStyledComponent,
}
