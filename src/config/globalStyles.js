import { modernNormalizeStyles, globalPreflightStyles } from './preflightStyles'
import { globalKeyframeStyles } from './../plugins/animation'
import { globalRingStyles } from './../plugins/ring'
import { globalBoxShadowStyles } from './../plugins/boxShadow'

const globalStyles = [
  modernNormalizeStyles,
  globalPreflightStyles,
  globalKeyframeStyles,
  globalRingStyles,
  globalBoxShadowStyles,
]

export default globalStyles
