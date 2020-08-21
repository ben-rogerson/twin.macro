import { throwIf, isEmpty } from './../../utils'
import { logTwImportUsageError } from './../../logging'
import { updateCssReferences } from './../css'
import { getStyleNode, convertTwArrayElements } from './shared'
export { handleTwProperty } from './property'

const handleTwFunction = ({ references, state, t }) => {
  const defaultImportReferences = references.default || []
  defaultImportReferences.forEach(path => {
    throwIf(
      ![
        'TaggedTemplateExpression',
        'CallExpression',
        'MemberExpression',
      ].includes(path.container.type),
      () => logTwImportUsageError
    )

    // Handle tw() / tw[]
    const elements = getStyleNode(path.container.type)({ e: path, state, t })

    /**
     * Tagged template expressions
     * eg: tw`flex` / css={tw`flex`}
     * This runs on a legacy handler
     * TODO: update with the newer handler style
     */
    if (path.container.type === 'TaggedTemplateExpression') {
      return
    }

    if (isEmpty(elements)) {
      return
    }

    convertTwArrayElements(elements, state, t, path)
    updateCssReferences(path, state)
  })
}

export { handleTwFunction }
