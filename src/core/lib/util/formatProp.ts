// eslint-disable-next-line import/no-relative-parent-imports
import { SPACE_ID, LINEFEED } from '../../constants'

const EXTRA_WHITESPACE = /\s\s+/g

export default function formatProp(classes: string): string {
  return (
    classes
      // Normalize spacing
      .replace(EXTRA_WHITESPACE, ' ')
      // Remove newline characters
      .replace(LINEFEED, ' ')
      // Replace the space id
      .replace(SPACE_ID, ' ')
      .trim()
  )
}
