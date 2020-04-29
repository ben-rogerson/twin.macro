import dlv from 'dlv'
import { staticStyles } from './../config'

export default ({ pieces }) => {
  const { className } = pieces
  /**
   * Static styles clone fix
   * Fixes strange merging on the last item in a screen class list
   * Test data: tw`text-center md:text-center sm:text-center`
   */
  const staticStylesFix = JSON.parse(JSON.stringify(staticStyles))
  return dlv(staticStylesFix, [className, 'output'])
}
