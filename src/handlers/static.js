import { staticStyles } from './../config'
import { get } from './../utils'

export default ({ pieces }) => {
  const { className } = pieces
  return get(staticStyles, [className, 'output'])
}
