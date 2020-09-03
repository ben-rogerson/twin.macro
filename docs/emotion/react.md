# Use Twin with "Vanilla" React + Emotion

**🔥 View the [React + Emotion + Tailwind Twin starter](https://codesandbox.io/embed/react-tailwind-emotion-starter-3d1dl?module=%2Fsrc%2FApp.js) for usage examples**

## Getting started

### 1. Install the dependencies

```bash
# React and Babel
npm install --save react react-dom @babel/core @emotion/babel-plugin-jsx-pragmatic babel-plugin-macros
# Twin and Emotion
npm install --save twin.macro @emotion/core @emotion/styled
```

<details>
  <summary>Yarn instructions</summary>

```bash
# React and Babel
yarn add react react-dom @babel/core @emotion/babel-plugin-jsx-pragmatic babel-plugin-macros
# Twin and Emotion
yarn add twin.macro @emotion/core @emotion/styled
```

</details>

### 2. Import the Tailwind base styles

Add the following to your `app.js` or `index.js`:
(the dependency 'tailwindcss' is already in your node_modules)

```js
// In your App.js or index.js entry
import 'tailwindcss/dist/base.min.css'
```

### 3. Add the recommended config

Twin’s recommended config can be added in a couple of different places.

**a) In your `package.json`:**

```js
// package.json
"babelMacros": {
    "twin": {
      "config": "tailwind.config.js",
      "preset": "emotion",
      "debugProp": true,
      "debugPlugins": false,
      "debug": false,
    }
},
```

**b) Or in a new file named `babel-plugin-macros.config.js` placed in your project root:**

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: 'tailwind.config.js',
    preset: 'emotion',
    debugProp: true,
    debugPlugins: false,
    debug: false,
  },
}
```

### 4. Enable babel macros and the jsx pragma

To use the `tw` and `css` props, emotion must first extend jsx with a [jsx pragma](https://emotion.sh/docs/css-prop#jsx-pragma).

**a) Auto inject the pragma:**

You can avoid adding the pragma yourself with the following babel config:

```js
// In .babelrc
{
  "plugins": [
    "babel-plugin-macros",
    [
      "@emotion/babel-plugin-jsx-pragmatic",
      {
        "export": "jsx",
        "import": "__cssprop",
        "module": "@emotion/core"
      }
    ],
    ["babel-plugin-transform-react-jsx", { "pragma": "__cssprop" }]
  ]
}
```

**b) Or add the jsx pragma manually:**

```js
// In .babelrc
{
  "plugins": [
    "babel-plugin-macros",
    "babel-plugin-transform-react-jsx"
  ]
}
```

Then when styling with the tw/css prop, add the two lines for the pragma at the top of your file. This will replace the react import:

```js
/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from 'twin.macro'

const Input = () => <input tw="bg-black" />
// or
const Input = () => <input css={tw`bg-black`} />
```

Then you can import react like normal:

```js
import React from 'react'
import tw from 'twin.macro'

const Input = () => <input tw="bg-black" />
// or
const Input = () => <input css={tw`bg-black`} />
```

> Note: After build, if you’re seeing "process is not defined" then npm install and add `"babel-plugin-transform-inline-environment-variables"` to .babelrc

### 5. Add the types for `css` and `styled` (TypeScript only)

While twin comes with types for the tw import, you’ll need to add the types for the `css` and `styled` imports.

[Read how to add the remaining types →](typescript.md)

## Options

| Name           | Type      | Default                | Description                                                                                                               |
| -------------- | --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| config         | `string`  | `"tailwind.config.js"` | The path to your Tailwind config                                                                                          |
| preset         | `string`  | `"emotion"`            | The css-in-js library behind the scenes - also supports 'styled-components' and 'goober'                                  |
| hasSuggestions | `boolean` | `true`                 | Display class suggestions when a class can't be found                                                                     |
| debugPlugins   | `boolean` | `false`                | Display generated class information in your terminal from your plugins                                                    |
| debugProp      | `boolean` | `false`                | Add a prop to your elements in development so you can see the original tailwind classes, eg: `<div data-tw="bg-black" />` |
| debug          | `boolean` | `false`                | Display information in your terminal about the Tailwind class conversions                                                 |

If twin’s default `styled` and `css` imports need to be adjusted, you can do so with the following config:<br/>

```js
{
  styled: { import: "default", from: "@emotion/styled" },
  css: { import: "css", from: "@emotion/core" }
}
```

**Note:** Make sure you remove the `preset` option as that value disables the styled + css options.

## Next steps

- See how to [customize your classes →](../customizing-config.md)
- Learn how to use the emotion library<br/>
  The [css prop](https://emotion.sh/docs/css-prop) / [css import](https://emotion.sh/docs/css-prop#string-styles) / [styled import](https://emotion.sh/docs/styled)

## Installation guides

- "Vanilla" React + Emotion (current)
- [Create React App + Emotion](create-react-app.md)
- [Gatsby + Emotion](gatsby.md)
- [Next.js + Emotion](next.md)
