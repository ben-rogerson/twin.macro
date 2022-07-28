import { SPACE_ID } from './constants'
export default classes =>
  classes
    // Normalize spacing
    .replace(/\s\s+/g, ' ')
    // Remove newline characters
    .replace(/\n/g, ' ')
    // Replace the space id
    .replace(SPACE_ID, ' ')
    .trim()
