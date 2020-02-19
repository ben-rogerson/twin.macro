import babylon from '@babel/parser'

export default function astify(literal, t) {
  if (literal === null) {
    return t.nullLiteral()
  }
  switch (typeof literal) {
    case 'function':
      let ast = babylon.parse(literal.toString(), {
        allowReturnOutsideFunction: true,
        allowSuperOutsideMethod: true
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
