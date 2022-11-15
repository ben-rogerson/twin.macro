import type { GetPackageUsed, TwinConfigAll } from 'core/types'

const TWIN_CONFIG_DEFAULTS = {
  allowStyleProp: false,
  autoCssProp: false,
  config: undefined,
  convertHtmlElementToStyled: false,
  convertStyledDot: false,
  css: { import: '', from: '' },
  dataCsProp: false,
  dataTwProp: false,
  debug: false,
  disableCsProp: true,
  disableShortCss: true,
  global: { import: '', from: '' },
  hasLogColors: true,
  includeClassNames: false,
  moveTwPropToStyled: false,
  moveKeyframesToGlobalStyles: false,
  preset: undefined,
  sassyPseudo: false,
  stitchesConfig: undefined,
  styled: { import: '', from: '' },
}

// Defaults for different css-in-js libraries
const configDefaultsGoober = { sassyPseudo: true } // Sets selectors like hover to &:hover
const configDefaultsStitches = {
  sassyPseudo: true, // Sets selectors like hover to &:hover
  convertStyledDot: true, // Convert styled.[element] to a default syntax
  moveTwPropToStyled: true, // Move the tw prop to a styled definition
  convertHtmlElementToStyled: true, // For packages like stitches, add a styled definition on css prop elements
  stitchesConfig: undefined, // Set the path to the stitches config
  moveKeyframesToGlobalStyles: true, // Stitches doesn't support inline @keyframes
}

function configDefaultsTwin({
  isGoober,
  isStitches,
  isDev,
}: GetPackageUsed & { isDev: boolean }): TwinConfigAll {
  return {
    ...TWIN_CONFIG_DEFAULTS,
    ...(isGoober && configDefaultsGoober),
    ...(isStitches && configDefaultsStitches),
    dataTwProp: isDev,
    dataCsProp: isDev,
  }
}

function isBoolean(value: unknown): boolean {
  return typeof value === 'boolean'
}

const allowedPresets = ['styled-components', 'emotion', 'goober', 'stitches']

type ConfigTwinValidators = Record<
  keyof typeof TWIN_CONFIG_DEFAULTS & 'disableColorVariables',
  [(value: unknown) => boolean, string]
>

const configTwinValidators: ConfigTwinValidators = {
  preset: [
    (value: unknown): boolean =>
      value === undefined ||
      (typeof value === 'string' && allowedPresets.includes(value)),
    `The config “preset” can only be:\n${allowedPresets
      .map(p => `'${p}'`)
      .join(', ')}`,
  ],
  allowStyleProp: [
    isBoolean,
    'The config “allowStyleProp” can only be a boolean',
  ],
  autoCssProp: [
    (value: unknown): boolean => !value,
    'The “autoCssProp” feature has been removed from twin.macro@2.8.2+\nThis means the css prop must be added by styled-components instead.\nSetup info at https://twinredirect.page.link/auto-css-prop\n\nRemove the “autoCssProp” item from your config to avoid this message.',
  ],
  disableColorVariables: [
    (value: unknown): boolean => !value,
    'The disableColorVariables feature has been removed from twin.macro@3+\n\nRemove the disableColorVariables item from your config to avoid this message.',
  ],
  sassyPseudo: [isBoolean, 'The config “sassyPseudo” can only be a boolean'],
  dataTwProp: [
    (value: unknown): boolean => isBoolean(value) || value === 'all',
    'The config “dataTwProp” can only be true, false or "all"',
  ],
  dataCsProp: [
    (value: unknown): boolean => isBoolean(value) || value === 'all',
    'The config “dataCsProp” can only be true, false or "all"',
  ],
  includeClassNames: [
    isBoolean,
    'The config “includeClassNames” can only be a boolean',
  ],
  disableCsProp: [
    isBoolean,
    'The config “disableCsProp” can only be a boolean',
  ],
  convertStyledDot: [
    isBoolean,
    'The config “convertStyledDot” can only be a boolean',
  ],
  moveTwPropToStyled: [
    isBoolean,
    'The config “moveTwPropToStyled” can only be a boolean',
  ],
  convertHtmlElementToStyled: [
    isBoolean,
    'The config “convertHtmlElementToStyled” can only be a boolean',
  ],
}

export { configDefaultsTwin, configTwinValidators, TWIN_CONFIG_DEFAULTS }
