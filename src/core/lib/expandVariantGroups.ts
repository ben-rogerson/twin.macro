import { logGeneralError } from './logging'
import {
  SPACE,
  SPACES,
  SPACE_ID_TEMP,
  // eslint-disable-next-line import/no-relative-parent-imports
} from '../constants'

function findRightBracket(
  classes: string,
  start = 0,
  end: number = classes.length,
  brackets = ['(', ')']
): number | undefined {
  let stack = 0
  for (let index = start; index < end; index++) {
    if (classes[index] === brackets[0]) {
      stack += 1
    } else if (classes[index] === brackets[1]) {
      if (stack === 0) return
      if (stack === 1) return index
      stack -= 1
    }
  }
}

function sliceToSpace(string: string): string {
  const spaceIndex = string.indexOf(' ')
  if (spaceIndex === -1) return string
  return string.slice(0, spaceIndex)
}

// eslint-disable-next-line max-params, complexity
function spreadVariantGroups(
  classes: string,
  context = '',
  importantContext = false,
  start = 0,
  end?: number
): string[] {
  if (classes === '') return []

  const results = []
  classes = classes.slice(start, end).trim()

  // variant / class / group
  const CLASS_PIECES = /(\[.*?]:|[\w-<>]+:)|(!?[\w-./[\]]+!?)|\(|(\S+)/g

  let match
  const baseContext = context

  while ((match = CLASS_PIECES.exec(classes))) {
    const [, variant, className, weird] = match

    if (variant) {
      // Replace arbitrary variant spaces with a placeholder to avoid incorrect splitting
      const spaceReplacedVariant = variant.replace(SPACES, SPACE_ID_TEMP)
      context += spaceReplacedVariant

      // Skip empty classes
      if (SPACE.test(classes[CLASS_PIECES.lastIndex])) {
        context = baseContext
        continue
      }

      // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
      if (classes[CLASS_PIECES.lastIndex] === '(') {
        const closeBracket = findRightBracket(classes, CLASS_PIECES.lastIndex)
        if (typeof closeBracket !== 'number')
          throw new Error(
            logGeneralError(
              `No end bracket \`)\` found for these classes:\n\n${classes}\n`
            )
          )

        const importantGroup = classes[closeBracket + 1] === '!'

        results.push(
          ...spreadVariantGroups(
            classes,
            context,
            importantContext || importantGroup,
            CLASS_PIECES.lastIndex + 1,
            closeBracket
          )
        )
        CLASS_PIECES.lastIndex = closeBracket + (importantGroup ? 2 : 1)
        context = baseContext
      }
    } else if (className?.includes('[')) {
      const closeBracket = findRightBracket(
        classes,
        match.index,
        classes.length,
        ['[', ']']
      )
      if (typeof closeBracket !== 'number')
        throw new Error(
          logGeneralError(
            `No end bracket \`)\` found for these classes:\n\n${classes}\n`
          )
        )

      const importantGroup = classes[closeBracket + 1] === '!'
      const cssClass = classes.slice(match.index, closeBracket + 1)

      const hasSlashOpacity =
        classes.slice(closeBracket + 1, closeBracket + 2) === '/'
      const opacityValue = hasSlashOpacity
        ? sliceToSpace(classes.slice(closeBracket + 1))
        : ''

      // Convert spaces in classes to a temporary string so the css won't be
      // split into multiple classes
      const spaceReplacedClass = cssClass
        // Normalize the spacing - single spaces only
        // Replace spaces with the space id stand-in
        // Remove newlines within the brackets to allow multiline values
        .replace(SPACES, SPACE_ID_TEMP)

      results.push(
        context +
          spaceReplacedClass +
          opacityValue +
          (importantGroup || importantContext ? '!' : '')
      )

      CLASS_PIECES.lastIndex =
        closeBracket + (importantGroup ? 2 : 1) + opacityValue.length
      context = baseContext
    } else if (className) {
      const tail = !className.endsWith('!') && importantContext ? '!' : ''
      results.push(context + className + tail)
      context = baseContext
    } else if (weird) {
      results.push(context + weird)
    } else {
      const closeBracket = findRightBracket(classes, match.index)

      if (typeof closeBracket !== 'number')
        throw new Error(
          logGeneralError(
            `No end bracket \`)\` found for these classes:\n\n${classes}\n`
          )
        )

      const importantGroup = classes[closeBracket + 1] === '!'
      results.push(
        ...spreadVariantGroups(
          classes,
          context,
          importantContext || importantGroup,
          match.index + 1,
          closeBracket
        )
      )
      CLASS_PIECES.lastIndex = closeBracket + (importantGroup ? 2 : 1)
    }
  }

  return results
}

function expandVariantGroups(classes: string): string {
  return spreadVariantGroups(classes).join(' ')
}

export default expandVariantGroups
