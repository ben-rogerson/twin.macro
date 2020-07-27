# Use Twin with "Vanilla" React + Styled Components

**🔥 View the [React + Styled Components + Tailwind Twin starter](https://codesandbox.io/embed/react-tailwind-styled-components-starter-f87y7) for usage examples**

## Getting started

### 1. Install the dependencies

```bash
# React and Babel
npm install --save react react-dom @babel/core @babel/plugin-transform-react-jsx
# Twin and Styled Components
npm install --save twin.macro styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
# React and Babel
yarn add react react-dom @babel/core @babel/plugin-transform-react-jsx
# Twin and Styled Components
yarn add twin.macro styled-components
```

</details>

### 2. Enable babel macros and jsx

```js
// In .babelrc
{
  "plugins": [
    "babel-plugin-macros",
    "@babel/plugin-transform-react-jsx",
  ]
}
```

### 3. Import the Tailwind base styles

Add the following to your `app.js` or `index.js`:
(the dependency 'tailwindcss' is already in your node_modules)

```js
// In your App.js or index.js entry
import 'tailwindcss/dist/base.min.css'
```

### 4. Add the recommended config

Twin’s recommended config can be added in a couple of different places.

a) In your `package.json`:

```js
// package.json
"babelMacros": {
    "twin": {
      "config": "tailwind.config.js",
      "preset": "styled-components",
      "autoCssProp": true,
      "debugProp": true,
      "debugPlugins": false,
      "debug": false,
    }
},
```

b) Or in a new file named `babel-plugin-macros.config.js` placed in your project root:

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: 'tailwind.config.js',
    preset: 'styled-components',
    autoCssProp: true,
    debugProp: true,
    debugPlugins: false,
    debug: false,
  },
}
```

### 5. Complete the TypeScript support (optional)

While twin comes with types for the tw import, you’ll need to add the types for the `css` and `styled` imports.

[Read how to add the remaining types →](typescript.md)

## Options

| Name           | Type      | Default                | Description                                                                                                                                                                                                              |
| -------------- | --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| config         | `string`  | `"tailwind.config.js"` | The path to your Tailwind config. (Set it to `src/tailwind.config.js` in create-react-app)                                                                                                                               |
| preset         | `string`  | `"emotion"`            | The css-in-js library behind the scenes - also supports 'styled-components' and 'goober'                                                                                                                                 |
| autoCssProp    | `boolean` | `false`                | This code automates the import of 'styled-components/macro' so you can use their css prop. Enable it if you're using styled-components with CRA or Vanilla React. If you're using Emotion, setting to true does nothing. |
| hasSuggestions | `boolean` | `true`                 | Display class suggestions when a class can't be found                                                                                                                                                                    |
| debugPlugins   | `boolean` | `false`                | Display generated class information in your terminal from your plugins                                                                                                                                                   |
| debugProp      | `boolean` | `false`                | Add a prop to your elements in development so you can see the original tailwind classes, eg: `<div data-tw="bg-black" />`                                                                                                |
| debug          | `boolean` | `false`                | Display information in your terminal about the Tailwind class conversions                                                                                                                                                |

If twin’s default `styled` and `css` imports need to be adjusted, you can do so with the following config:

```js
{
  styled: { import: "default", from: "styled-components" },
  css: { import: "css", from: "styled-components/macro" }
}
```

**Note:** Make sure you remove the `preset` option as that value disables the styled + css options.

## Next steps

- [Customize your config](../customizing-config.md)
- [Styling with the css prop](../css-prop-guide.md)
- [Styling with the styled import](../styled-import-guide.md)
- [React + Styled Components + Tailwind Twin starter](https://codesandbox.io/embed/react-tailwind-styled-components-starter-f87y7)

### Official resources

- [Styled Components: The css prop](https://styled-components.com/docs/api#css-prop)
- [Styled Components: The css import](https://styled-components.com/docs/api#css)
- [Styled Components: The styled import](https://styled-components.com/docs/api#styled)
