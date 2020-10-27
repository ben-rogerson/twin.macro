# Use Twin with Create React App + Emotion

**🔥 View the [CRA + Emotion + Tailwind Twin starter](https://codesandbox.io/embed/cra-tailwind-emotion-starter-bi1kx?module=%2Fsrc%2FApp.js) for usage examples**

## Getting started

### 1. Install Create React App

```bash
npx create-react-app my-app
```

### 2. Install the dependencies

```bash
npm install --save twin.macro @emotion/core @emotion/styled
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro @emotion/core @emotion/styled
```

</details>

### 3. Add the global styles

Projects using Twin also use the Tailwind [preflight base styles](https://unpkg.com/tailwindcss/dist/base.css) to smooth over cross-browser inconsistencies.

Twin adds the preflight base styles with the `GlobalStyles` import which you can add in `src/App.js`:

```js
// src/App.js
import React from 'react'
import { GlobalStyles } from 'twin.macro'

const App = () => (
  <>
    <GlobalStyles />
    <App />
  </>
)

export default App
```

`GlobalStyles` also includes some [@keyframes](https://github.com/ben-rogerson/twin.macro/blob/master/src/config/globalStyles.js) so the `animate-xxx` classes have animations. But if you’re not using the animate classes then you can [avoid adding the extra keyframes](https://github.com/ben-rogerson/twin.macro/blob/master/docs/extra-keyframes.md).

### 4. Add the recommended config

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

### 5. Enable babel macros and the jsx pragma

To use the `tw` and `css` props, emotion must first extend jsx with a [jsx pragma](https://emotion.sh/docs/css-prop#jsx-pragma).

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

You can automate the injection of the jsx pragma but you’ll need to use a package like [rewire create react app](https://github.com/timarney/react-app-rewired) to allow changes to the project `.babelrc`. Check the [emotion + react docs](./react.md) for the babel config.

> Note: After build, if you’re seeing "process is not defined" then npm install and add `"babel-plugin-transform-inline-environment-variables"` to .babelrc

### 6. Add the types for `css` and `styled` (TypeScript only)

Twin comes with types for every import except the `css` and `styled` imports.

[Add the remaining types →](typescript.md)

## Options

| Name                  | Type      | Default                | Description                                                                                                               |
| --------------------- | --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| config                | `string`  | `"tailwind.config.js"` | The path to your Tailwind config                                                                                          |
| preset                | `string`  | `"emotion"`            | The css-in-js library behind the scenes - also supports 'styled-components' and 'goober'                                  |
| hasSuggestions        | `boolean` | `true`                 | Display class suggestions when a class can't be found                                                                     |
| debugPlugins          | `boolean` | `false`                | Display generated class information in your terminal from your plugins                                                    |
| debugProp             | `boolean` | `false`                | Add a prop to your elements in development so you can see the original tailwind classes, eg: `<div data-tw="bg-black" />` |
| debug                 | `boolean` | `false`                | Display information in your terminal about the Tailwind class conversions                                                 |
| disableColorVariables | `boolean` | `false`                | Disable css variables in colors (not gradients) to help support IE11/react native                                         |

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

- ["Vanilla" React + Emotion](react.md)
- Create React App + Emotion (current)
- [Gatsby + Emotion](gatsby.md)
- [Next.js + Emotion](next.md)
