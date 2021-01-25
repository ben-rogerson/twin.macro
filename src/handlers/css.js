import { SPACE_ID } from './../contants'
import { throwIf } from './../utils'
import { logBadGood } from './../logging'

export default ({ className }) => {
  const [property, value] = className
    .replace(']', '')
    // Replace the "stand-in spaces" with real ones
    .replace(new RegExp(SPACE_ID, 'g'), ' ')
    .split('[')

  throwIf(!property, () =>
    logBadGood(
      `“[${value}]” is missing the css property before the square brackets`,
      `Write it like this: marginTop[${value || '5rem'}]`
    )
  )

  return { [property]: value }
}
