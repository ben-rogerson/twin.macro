// Defaults for different css-in-js libraries
const configDefaultsStyledComponents = { autoCssProp: true } // Automates the import of styled-components when you use their css prop
const configDefaultsGoober = { sassyPseudo: true } // Sets selectors like hover to &:hover

const configDefaultsTwin = ({ isStyledComponents, isGoober }) => ({
  allowStyleProp: false, // Allows styles within style="blah" without throwing an error
  autoCssProp: false, // Automates the import of styled-components when you use their css prop
  disableColorVariables: false, // Disable css variables in colors (except gradients) to support older browsers/react native
  hasSuggestions: true, // Switch suggestions on/off when you use a tailwind class that's not found
  sassyPseudo: false, // Sets selectors like hover to &:hover
  // ...
  // TODO: Add the rest of the twin config items here (ongoing migration)
  ...(isStyledComponents && configDefaultsStyledComponents),
  ...(isGoober && configDefaultsGoober),
})

const isBoolean = value => typeof value === 'boolean'

const configTwinValidators = {
  allowStyleProp: [
    isBoolean,
    'The config “allowStyleProp” can only be true or false',
  ],
  autoCssProp: [
    isBoolean,
    'The config “autoCssProp” can only be true or false',
  ],
  disableColorVariables: [
    isBoolean,
    'The config “disableColorVariables” can only be true or false',
  ],
  hasSuggestions: [
    isBoolean,
    'The config “hasSuggestions” can only be true or false',
  ],
  sassyPseudo: [
    isBoolean,
    'The config “sassyPseudo” can only be true or false',
  ],
}

export { configDefaultsTwin, configTwinValidators }
