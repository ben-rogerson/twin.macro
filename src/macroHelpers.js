import babylon from '@babel/parser'

function addImport({ types: t, program, mod, name, identifier }) {
  if (name === 'default') {
    program.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importDefaultSpecifier(identifier)],
        t.stringLiteral(mod)
      )
    )
  } else {
    program.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importSpecifier(identifier, t.identifier(name))],
        t.stringLiteral(mod)
      )
    )
  }
}

function assignify(objAst, t) {
  if (objAst.type !== 'ObjectExpression') return objAst

  let cloneNode = t.cloneNode || t.cloneDeep
  let currentChunk = []
  let chunks = []

  objAst.properties.forEach(property => {
    if (property.type === 'SpreadElement') {
      if (currentChunk.length) {
        chunks.push(cloneNode(t.objectExpression(currentChunk)))
        currentChunk.length = 0
      }
      chunks.push(cloneNode(property.argument))
    } else {
      property.value = assignify(property.value, t)
      currentChunk.push(property)
    }
  })

  if (chunks.length === 0) return objAst

  if (currentChunk.length) {
    chunks.push(cloneNode(t.objectExpression(currentChunk)))
  }

  return t.callExpression(
    t.memberExpression(t.identifier('Object'), t.identifier('assign')),
    chunks
  )
}

function astify(literal, t) {
  if (literal === null) {
    return t.nullLiteral()
  }
  switch (typeof literal) {
    case 'function':
      let ast = babylon.parse(literal.toString(), {
        allowReturnOutsideFunction: true,
        allowSuperOutsideMethod: true,
      })
      return traverse.removeProperties(ast)
    case 'number':
      return t.numericLiteral(literal)
    case 'string':
      if (literal.startsWith('__computed__')) {
        return babylon.parseExpression(literal.substr(12))
      }
      return t.stringLiteral(literal)
    case 'boolean':
      return t.booleanLiteral(literal)
    case 'undefined':
      return t.unaryExpression('void', t.numericLiteral(0), true)
    default:
      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map(x => astify(x, t)))
      }
      try {
        return t.objectExpression(
          objectExpressionElements(literal, t, 'spreadElement')
        )
      } catch (err) {
        return t.objectExpression(
          objectExpressionElements(literal, t, 'spreadProperty')
        )
      }
  }
}

function objectExpressionElements(literal, t, spreadType) {
  return Object.keys(literal)
    .filter(k => {
      return typeof literal[k] !== 'undefined'
    })
    .map(k => {
      if (k.startsWith('__spread__')) {
        return t[spreadType](babylon.parseExpression(literal[k]))
      } else {
        let computed = k.startsWith('__computed__')
        let key = computed
          ? babylon.parseExpression(k.substr(12))
          : t.stringLiteral(k)
        return t.objectProperty(key, astify(literal[k], t), computed)
      }
    })
}

function findIdentifier({ program, mod, name }) {
  let identifier = null

  program.traverse({
    ImportDeclaration(path) {
      if (path.node.source.value !== mod) return

      path.node.specifiers.some(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          if (name === 'default') {
            identifier = specifier.local
            return true
          }
        } else if (specifier.imported.name === name) {
          identifier = specifier.local
          return true
        }
        return false
      })
    },
  })

  return identifier
}

function parseTte({ path, types: t, styledIdentifier, state }) {
  let cloneNode = t.cloneNode || t.cloneDeep

  if (
    path.node.tag.type !== 'Identifier' &&
    path.node.tag.type !== 'MemberExpression' &&
    path.node.tag.type !== 'CallExpression'
  )
    return null

  let str = path.get('quasi').get('quasis')[0].node.value.cooked
  let strLoc = path.get('quasi').node.loc

  if (path.node.tag.type === 'CallExpression') {
    replaceWithLocation(
      path.get('tag').get('callee'),
      cloneNode(styledIdentifier)
    )
    state.shouldImportStyled = true
  } else if (path.node.tag.type === 'MemberExpression') {
    replaceWithLocation(
      path.get('tag').get('object'),
      cloneNode(styledIdentifier)
    )

    state.shouldImportStyled = true
  }

  if (
    path.node.tag.type === 'CallExpression' ||
    path.node.tag.type === 'MemberExpression'
  ) {
    replaceWithLocation(
      path,
      t.callExpression(cloneNode(path.node.tag), [
        t.identifier('__twPlaceholder'),
      ])
    )

    path = path.get('arguments')[0]
  }

  path.node.loc = strLoc

  return { str, path }
}

function replaceWithLocation(path, replacement) {
  let newPaths = replacement ? path.replaceWith(replacement) : []
  if (Array.isArray(newPaths) && newPaths.length) {
    let loc = path.node.loc
    newPaths.forEach(p => {
      p.node.loc = loc
    })
  }
  return newPaths
}

export {
  addImport,
  assignify,
  astify,
  findIdentifier,
  parseTte,
  replaceWithLocation,
}
