export default function replaceWithLocation(path, replacement) {
  let newPaths = replacement ? path.replaceWith(replacement) : []
  if (Array.isArray(newPaths) && newPaths.length) {
    let loc = path.node.loc
    newPaths.forEach(p => {
      p.node.loc = loc
    })
  }
  return newPaths
}
