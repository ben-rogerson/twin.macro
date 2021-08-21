import { modernNormalizeStyles, globalPreflightStyles } from './preflightStyles'
import { globalKeyframeStyles } from './../plugins/animation'
import { globalRingStyles } from './../plugins/ring'
import { globalBoxShadowStyles } from './../plugins/boxShadow'

export const globalTransformStyles = {
  '*, ::before, ::after': {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    '--tw-transform': [
      'translateX(var(--tw-translate-x))',
      'translateY(var(--tw-translate-y))',
      'rotate(var(--tw-rotate))',
      'skewX(var(--tw-skew-x))',
      'skewY(var(--tw-skew-y))',
      'scaleX(var(--tw-scale-x))',
      'scaleY(var(--tw-scale-y))',
    ].join(' '),
  },
}

export const globalFilterStyles = {
  '*, ::before, ::after': {
    '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-filter': [
      'var(--tw-blur)',
      'var(--tw-brightness)',
      'var(--tw-contrast)',
      'var(--tw-grayscale)',
      'var(--tw-hue-rotate)',
      'var(--tw-invert)',
      'var(--tw-saturate)',
      'var(--tw-sepia)',
      'var(--tw-drop-shadow)',
    ].join(' '),
  },
}

export const globalBackdropStyles = {
  '*, ::before, ::after': {
    '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-backdrop-filter': [
      'var(--tw-backdrop-blur)',
      'var(--tw-backdrop-brightness)',
      'var(--tw-backdrop-contrast)',
      'var(--tw-backdrop-grayscale)',
      'var(--tw-backdrop-hue-rotate)',
      'var(--tw-backdrop-invert)',
      'var(--tw-backdrop-opacity)',
      'var(--tw-backdrop-saturate)',
      'var(--tw-backdrop-sepia)',
    ].join(' '),
  },
}

const globalStyles = [
  modernNormalizeStyles,
  globalPreflightStyles,
  globalKeyframeStyles,
  globalTransformStyles,
  globalRingStyles,
  globalBoxShadowStyles,
  globalFilterStyles,
  globalBackdropStyles,
]

export default globalStyles
