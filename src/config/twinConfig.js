const configGooberDefaults = { sassyPseudo: true }

const configTwinDefaults = state => ({
  allowStyleProp: false, // Allows styles within style="blah" without throwing an error
  autoCssProp: false, // Automates the import of styled-components so you can use their css prop
  hasSuggestions: true, // Switch suggestions on/off when you use a tailwind class that's not found
  sassyPseudo: false, // Sets selectors like hover to &:hover
  // ...
  // TODO: Add the rest of the twin config items here (ongoing migration)
  ...(state.isGoober && configGooberDefaults),
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
  hasSuggestions: [
    isBoolean,
    'The config “hasSuggestions” can only be true or false',
  ],
  sassyPseudo: [
    isBoolean,
    'The config “sassyPseudo” can only be true or false',
  ],
}

export { configTwinDefaults, configTwinValidators }
