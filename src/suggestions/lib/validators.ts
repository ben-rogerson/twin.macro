import { validateVariants } from './validateVariants'
import type { ClassErrorContext } from 'suggestions/types'

const validators = [
  // Validate the opacity
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    const className = pieces.slice(-1).join('')
    const opacityMatch = /\/(\w+)$/.exec(className)
    if (!opacityMatch) return

    const opacityConfig = context.tailwindConfig.theme?.opacity ?? {}
    if (opacityConfig[opacityMatch[1] as keyof typeof opacityConfig]) return

    const choices = Object.entries(opacityConfig)
      .map(
        ([k, v]: [string, string]): string =>
          `${context.color('-', 'subdued')} ${context.color(
            k,
            'success'
          )} ${context.color('>', 'subdued')} ${v}`
      )
      .join('\n')
    return `${context.color(
      `✕ ${context.color(
        className,
        'errorLight'
      )} doesn’t have an opacity from your config`,
      'error'
    )}\n\nTry one of these opacity values:\n\n${choices}`
  },
  // Validate the group class
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    if (!pieces.includes('group')) return
    return `${context.color(
      `✕ ${context.color('group', 'errorLight')} is used like a normal class`,
      'error'
    )}\n\nAdd group in a ${context.color(
      'className',
      'success'
    )}:\n\n<div ${context.color(
      'className="group"',
      'success'
    )}>\n\n<div tw="group-hover:bg-black" />\n</div>\n\nRead more at https://twinredirect.page.link/group`
  },
  // Validate the peer class
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    if (!pieces.includes('peer')) return
    return `${context.color(
      `✕ ${context.color('peer', 'errorLight')} is used like a normal class`,
      'error'
    )}\n\nAdd peer in a ${context.color(
      'className',
      'success'
    )}:\n\n<div ${context.color(
      'className="peer"',
      'success'
    )}>\n<div tw="peer-hover:bg-black" />\n\nRead more at https://twinredirect.page.link/peer`
  },
  // Validate the lead class (from the official typography plugin)
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    if (!pieces.includes('lead')) return
    return `${context.color(
      `✕ ${context.color('lead', 'errorLight')} is used like a normal class`,
      'error'
    )}\n\nAdd lead in a ${context.color(
      'className',
      'success'
    )}:\n\n<div ${context.color(
      'className="lead"',
      'success'
    )}>...</div>\n\nRead more at https://twinredirect.page.link/peer`
  },
  // Validate the dark class
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    const className = pieces.slice(-1).join('')
    if (className !== 'dark') return
    return `${context.color(
      `✕ ${context.color('dark', 'errorLight')} is used like a normal class`,
      'error'
    )}\n\nAdd dark in a ${context.color(
      'className',
      'success'
    )}:\n<body ${context.color(
      'className="dark"',
      'success'
    )}>...</body>\n\nOr as a ${context.color(
      'variant',
      'success'
    )}:\n<div tw="${context.color(
      'dark',
      'success'
    )}:(bg-white text-black)" />\n\nRead more at https://twinredirect.page.link/darkLightMode`
  },
  // Validate the light class
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    const className = pieces.slice(-1).join('')
    if (className !== 'light') return
    return `${context.color(
      `✕ ${context.color('light', 'errorLight')} is used like a normal class`,
      'error'
    )}\n\nAdd light in a ${context.color(
      'className',
      'success'
    )}:\n<body ${context.color(
      'className="light"',
      'success'
    )}>...</body>\n\nOr as a ${context.color(
      'variant',
      'success'
    )}:\n<div tw="${context.color(
      'light',
      'success'
    )}:(bg-white text-black)" />\n\nRead more at https://twinredirect.page.link/darkLightMode`
  },
  // Validate any variants
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    const variants = pieces.slice(0, -1)
    const variantError = variants
      .map(variant => validateVariants(variant, context))
      .filter(Boolean)
    if (variantError.length === 0) return
    return variantError[0] as string
  },
  // If prefix is set, validate the class for the prefix
  (pieces: string[], context: ClassErrorContext): undefined | string => {
    const { prefix } = context.tailwindConfig
    const className = pieces.slice(-1).join('')
    if (prefix && !className.startsWith(prefix))
      return `${context.color(
        `✕ ${context.color(
          className,
          'errorLight'
        )} doesn’t have the right prefix`,
        'error'
      )}\n\nAdd the ${context.color(prefix, 'success')} prefix to the class`
  },
]

export { validators }
