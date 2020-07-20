## Use Twin with Next + Emotion

**🔥 View the [Next + Emotion + Tailwind Twin starter](https://codesandbox.io/embed/next-tailwind-emotion-starter-8h2b2?module=%2Fpages%2Findex.js) for usage examples**

## Getting started

### 1. Install the dependencies

After creating your next app:

```bash
npm install --save twin.macro @emotion/core @emotion/styled @emotion/babel-preset-css-prop
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro @emotion/core @emotion/styled @emotion/babel-preset-css-prop
```

</details>

### 2. Enable babel macros and the css prop

```js
// In .babelrc
{
  "presets": [
    "next/babel",
    "@emotion/babel-preset-css-prop"
  ],
  "plugins": [
    "babel-plugin-macros"
  ]
}
```

### 3. Import the Tailwind base styles

In `pages/_app.js`, add the following:

```js
import React from 'react'
import 'tailwindcss/dist/base.min.css'

const App = ({ Component, pageProps }) => <Component {...pageProps} />

export default App
```

### 5. Add the recommended config

Twin’s recommended config can be added in a couple of different places.

a) In your `package.json`:

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

b) Or in a new file named `babel-plugin-macros.config.js` placed in your project root:

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

### 6. Complete the TypeScript support (optional)

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

- ["Vanilla" React + Emotion](react.md)
- [Create React App + Emotion](create-react-app.md)
- [Gatsby + Emotion](gatsby.md)
- Next.js + Emotion (current)
