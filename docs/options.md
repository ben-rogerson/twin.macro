# Twin config options

Twin’s config can be added in a couple of different files.

a) Either in `babel-plugin-macros.config.js`:

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    // ...
  },
}
```

b) Or in `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    // ...
  }
},
```

## Options

You can add these options in your twin config:

| Name                  | Default                | Description                                                                                                                                                          |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config                | `"tailwind.config.js"` | The path to your Tailwind config.                                                                                                                                    |
| preset                | `"emotion"`            | The css-in-js library behind the scenes - also allows `'styled-components'` and `'goober'`.                                                                          |
| hasSuggestions        | `true`                 | Display suggestions when a class isn’t found.                                                                                                                        |
| dataTwProp            | `true`                 | Add a prop to your elements in development so you can see the original tailwind classes, eg: `<div data-tw="bg-black" />`, add `all` to keep the prop in production. |
| debugPlugins          | `false`                | Display generated class information in your terminal from your plugins.                                                                                              |
| debug                 | `false`                | Display information in your terminal about the Tailwind class conversions.                                                                                           |
| disableColorVariables | `false`                | Disable css variables in colors (not gradients).                                                                                                                     |
| disableShortCss       | `false`                | Disable converting short css within the tw import/prop.                                                                                                              |
| includeClassNames     | `false`                | Look in className props for tailwind classes to convert.                                                                                                             |
| dataCsProp            | `true`                 | Add a prop to your elements in development so you can see the original cs prop classes, eg: `<div data-cs="maxWidth[1em]" />`.                                       |
| disableCsProp         | `false`                | Disable twin from reading values specified in the cs prop.                                                                                                           |
| sassyPseudo           | `false`                | Some css-in-js frameworks require the `&` in selectors like `&:hover`, this option ensures it’s added.                                                               |

### config

```js
config: 'tailwind.config.js', // Path to the tailwind config
```

Set a custom location by specifying a path to your tailwind.config.js file.

**Monorepos / Workspaces**: The tailwind.config.js is commonly added as a shared file in the project root so you may need to add a `path.resolve` on the pathname in the twin config:

```js
// babel-plugin-macros.config.js
const path = require('path')

module.exports = {
  twin: {
    config: path.resolve(__dirname, '../../', 'tailwind.config.js'),
  },
}
```

### preset

```js
preset: 'emotion', // Set the css-in-js library to use with twin
```

Supports: `'emotion'` / `'styled-components'` / `'goober'`.

The preset controls which imports get added when twins `css`, `styled` and `GlobalStyles` imports are used.

- [stitches](https://stitches.dev/) is supported but doesn’t have a preset yet - [see example](https://github.com/ben-rogerson/twin.examples/tree/master/next-stitches-typescript)

### hasSuggestions

```js
hasSuggestions: false, // Set the display of suggestions when a class isn’t found
```

Set `hasSuggestions` to `false` to remove the display of suggestions in your terminal.

### dataTwProp

```js
dataTwProp: false, // Set the display of the data-tw prop on jsx elements
```

The `data-tw` prop gets added to your elements while in development so you can see the original tailwind classes:

```js
<div data-tw="bg-black" />
```

If you add the value `all`, twin will add the data-tw prop in production as well as development.

### debugPlugins

```js
debugPlugins: true, // Display generated class information from your plugins
```

By adding debugPlugins: true to your config, you'll see a list of classes and the css your plugins are creating.
Visualising this data helps iron out bugs when you're adding or editing plugins.
The feedback only displays in development.

### debug

```js
debug: true, // Display information about the Tailwind class conversions
```

The feedback only displays in development.

### disableColorVariables

When disableColorVariables set to true, css variables are disabled for the following types of classes:

```js
import tw from 'twin.macro'

tw`border-green-400`
tw`text-green-400`
tw`bg-green-400`
tw`placeholder-green-500`
tw`divide-green-500`

// ↓ ↓ ↓ ↓ ↓ ↓
;({
  borderColor: '#68d391',
})
;({
  color: '#68d391',
})
;({
  backgroundColor: '#68d391',
})
;({
  '::placeholder': {
    color: '#48bb78',
  },
})
;({
  '> :not(template) ~ :not(template)': {
    borderColor: '#48bb78',
  },
})
```

Note that opacity classes won’t work and gradients aren’t affected while in this mode:

```js
import tw from 'twin.macro'

tw`text-green-400 text-opacity-50`
tw`bg-gradient-to-b from-gray-100 to-gray-200`

// ↓ ↓ ↓ ↓ ↓ ↓
;({
  color: '#68d391',
  '--text-opacity': '0.5',
})
;({
  backgroundImage: 'linear-gradient(to bottom, var(--gradient-color-stops))',
  '--gradient-from-color': '#f7fafc',
  '--gradient-color-stops':
    'var(--gradient-from-color), var(--gradient-to-color, rgba(247, 250, 252, 0))',
  '--gradient-to-color': '#edf2f7',
})
```

### disableShortCss

```js
disableShortCss: true, // Disable converting short css within the tw import/prop
```

When set to `true`, this will throw an error if short css is added within the tw import or tw prop.

If you want to disable short css completely, you’ll also need to set `dataCsProp: false`.

### includeClassNames

```js
includeClassNames: true, // Check className props for tailwind classes to convert
```

When a tailwind class is found in a className prop, it’s plucked out, converted and delivered to the css-in-js library.

- Unmatched classes are skipped and preserved within the className
- Suggestions aren’t shown for unmatched classes like they are for the tw prop
- The tw and css props can be used on the same jsx element
- Limitation: classNames with conditional props or variables aren’t touched, eg: `<div className={isBlock && "block"} />`

### dataCsProp

```js
dataCsProp: false, // JSX prop twin adds that shows the original cs prop classes
```

If you add short css within the `cs` prop then twin will add a `data-cs` prop to preserve the css you added.
This option controls the display of the prop.

Shows in development only.

### disableCsProp

```js
disableCsProp: true, // Whether to read short css values added in a `cs` prop
```

If you're using the cs prop for something else or don’t want other developers using the feature you can disable it with this option.

### sassyPseudo

```js
sassyPseudo: true, // Prefix pseudo selectors with a `&`
```

Some css-in-js frameworks require the `&` in selectors like `&:hover`, this option ensures it’s added.
