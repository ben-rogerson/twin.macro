export default function showError(className) {
  if (!className) return
  throw new Error(`Class “${className}” not found in Tailwind config.`)

  // if (!results) {
  //   const firstPart = className.split('-')[0]
  //   return {
  //     errors: `Class “${className}” not found.\n\Available classes:\n${
  //       newStyle
  //         ? Object.keys(newStyle)
  //             // Format feedback: Remove dashes in classname
  //             .map(i => `${firstPart}-${key.split('-').join('')}-${i}`)
  //             .join(', ')
  //         : Object.entries(findKey)
  //             .map(([k, v]) =>
  //               typeof v === 'object'
  //                 ? `${Object.keys(v)
  //                     .map(i => `${firstPart}-${k}-${i}`)
  //                     .join(', ')}`
  //                 : typeof v === 'function'
  //                 ? `${firstPart}-${k} ${v.toString()}`
  //                 : `${firstPart}-${k}`
  //             )
  //             .join('\n')
  //     }\n\n`
  //   }
  // }
}
