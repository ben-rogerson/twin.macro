export default function addImport({
  types: t,
  program,
  mod,
  name,
  identifier
}) {
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
