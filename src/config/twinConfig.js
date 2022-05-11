// Defaults for different css-in-js libraries
const configDefaultsGoober = { sassyPseudo: true } // Sets selectors like hover to &:hover
const configDefaultsStitches = {
  sassyPseudo: true, // Sets selectors like hover to &:hover
  convertStyledDot: true, // Convert styled.[element] to a default syntax
  moveTwPropToStyled: true, // Move the tw prop to a styled definition
  convertHtmlElementToStyled: true, // For packages like stitches, add a styled definition on css prop elements
  stitchesConfig: undefined, // Set the path to the stitches config
}

const configDefaultsTwin = ({ isGoober, isStitches, isDev }) => ({
  allowUnsupportedPlugins: false, // Allow plugins to use an unsupported API function, eg: addVariant()
  allowStyleProp: false, // Allows styles within style="blah" without throwing an error
  autoCssProp: false, // Deprecated since v2.8.2
  dataTwProp: isDev, // During development, add a data-tw="" prop containing your tailwind classes for backtracing
  hasSuggestions: true, // Switch suggestions on/off when you use a tailwind class that's not found
  sassyPseudo: false, // Sets selectors like hover to &:hover
  debug: false, // Show the output of the classes twin converts
  debugPlugins: false, // Display generated class information from your plugins
  includeClassNames: false, // Look in the className props for tailwind classes to convert
  dataCsProp: isDev, // During development, add a data-cs="" prop containing your short css classes for backtracing
  disableCsProp: false, // Disable converting css styles in the cs prop
  disableShortCss: false, // Disable converting css written using short css
  config: undefined, // Set the path to the tailwind config
  ...(isGoober && configDefaultsGoober),
  ...(isStitches && configDefaultsStitches),
})

const isBoolean = value => typeof value === 'boolean'

const allowedPresets = ['styled-components', 'emotion', 'goober', 'stitches']

const configTwinValidators = {
  preset: [
    value => value === undefined || allowedPresets.includes(value),
    `The config “preset” can only be:\n${allowedPresets
      .map(p => `'${p}'`)
      .join(', ')}`,
  ],
  allowStyleProp: [
    isBoolean,
    'The config “allowStyleProp” can only be true or false',
  ],
  autoCssProp: [
    value => value !== true,
    'The “autoCssProp” feature has been removed from twin.macro@2.8.2+\nThis means the css prop must be added by styled-components instead.\nSetup info at https://twinredirect.page.link/auto-css-prop\n\nRemove the “autoCssProp” item from your config to avoid this message.',
  ],
  disableColorVariables: [
    value => value !== true,
    'The disableColorVariables feature has been removed from twin.macro@3+\n\nRemove the disableColorVariables item from your config to avoid this message.',
  ],
  hasSuggestions: [
    isBoolean,
    'The config “hasSuggestions” can only be true or false',
  ],
  sassyPseudo: [
    isBoolean,
    'The config “sassyPseudo” can only be true or false',
  ],
  dataTwProp: [
    value => isBoolean(value) || value === 'all',
    'The config “dataTwProp” can only be true, false or "all"',
  ],
  dataCsProp: [
    value => isBoolean(value) || value === 'all',
    'The config “dataCsProp” can only be true, false or "all"',
  ],
  debugProp: [
    value => value === undefined,
    `The “debugProp” option was renamed to “dataTwProp”, please rename it in your twin config`,
  ],
  includeClassNames: [
    isBoolean,
    'The config “includeClassNames” can only be true or false',
  ],
  disableCsProp: [
    isBoolean,
    'The config “disableCsProp” can only be true or false',
  ],
  convertStyledDot: [
    isBoolean,
    'The config “convertStyledDot” can only be true or false',
  ],
  moveTwPropToStyled: [
    isBoolean,
    'The config “moveTwPropToStyled” can only be true or false',
  ],
  convertHtmlElementToStyled: [
    isBoolean,
    'The config “convertHtmlElementToStyled” can only be true or false',
  ],
}

export { configDefaultsTwin, configTwinValidators }
