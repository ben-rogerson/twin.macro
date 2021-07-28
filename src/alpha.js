import { opacityErrorNotFound, logGeneralError } from './logging'
import { get, throwIf } from './utils'

const getAlphaValue = alpha =>
  Number.isInteger(Number(alpha)) ? Number(alpha) / 100 : alpha

const splitAlpha = props => {
  const { className } = props
  const slashIdx = className.lastIndexOf('/')
  throwIf(slashIdx === className.length - 1, () =>
    logGeneralError(`The class “${className}” can’t end with a slash`)
  )
  if (slashIdx === -1) return { className }

  const rawAlpha = className.slice(Number(slashIdx) + 1)
  const hasAlphaArbitrary = Boolean(
    rawAlpha[0] === '[' && rawAlpha[rawAlpha.length - 1] === ']'
  )

  const shouldQueueOpacityError =
    !hasAlphaArbitrary && !get(props, 'state.config.theme.opacity')[rawAlpha]

  return {
    alpha: hasAlphaArbitrary ? rawAlpha.slice(1, -1) : getAlphaValue(rawAlpha),
    classNameNoSlashAlpha: className.slice(0, slashIdx),
    hasAlpha: true,
    hasAlphaArbitrary,
    // Queue a validation error for later if the class isn't directly matched
    alphaError:
      shouldQueueOpacityError &&
      (() =>
        opacityErrorNotFound({
          className: className.slice(0, slashIdx),
          theme: get(props, 'state.config.theme.opacity'),
          opacity: rawAlpha,
        })),
  }
}

export { splitAlpha }
