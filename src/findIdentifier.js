export default function findIdentifier({ program, mod, name }) {
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
    }
  })

  return identifier
}
