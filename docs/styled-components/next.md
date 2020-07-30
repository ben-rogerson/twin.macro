# Use Twin with Next + Styled Components

**🔥 View the [Next + Styled Components + Tailwind Twin starter](https://codesandbox.io/embed/next-tailwind-styled-components-starter-m1f6d?module=%2Fpages%2Findex.js) for usage examples**

## Getting started

### 1. Install the dependencies

After creating your next app:

```bash
npm install --save twin.macro styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro styled-components
```

</details>

### 2. Enable babel macros and configure styled-components

```js
// In .babelrc
{
  "presets": [
    "next/babel"
  ],
  "plugins": [
    "babel-plugin-macros",
    [
      "styled-components",
      {
        "ssr": true
      }
    ]
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

### 4. Add the recommended config

Twin’s recommended config can be added in a couple of different places.

a) In your `package.json`:

```js
// package.json
"babelMacros": {
    "twin": {
      "config": "tailwind.config.js",
      "preset": "styled-components",
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
    debugProp: true,
    debugPlugins: false,
    debug: false,
  },
}
```

### 5. Complete the TypeScript support (optional)

While twin comes with types for the tw import, you’ll need to add the types for the `css` and `styled` imports.

[Read how to add the remaining types →](typescript.md)

### 6. Add the server stylesheet (optional)

To avoid the ugly Flash Of Unstyled Content (FOUC), add a server stylesheet in `pages/_document.js` that gets read by Next.js:

```js
// pages/_document.js
import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })
      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
```

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
  styled: { import: "default", from: "styled-components" },
  css: { import: "css", from: "styled-components/macro" }
}
```

**Note:** Make sure you remove the `preset` option as that value disables the styled + css options.

## Next steps

- See how to [customize your classes →](../customizing-config.md)
- Learn how to use the styled-components library<br/>
  The [css prop](https://styled-components.com/docs/api#css-prop) / [css import](https://styled-components.com/docs/api#css) / [styled import](https://styled-components.com/docs/api#styled)

## Installation guides

- ["Vanilla" React + Styled Components](react.md)
- [Create React App + Styled Components](create-react-app.md)
- [Gatsby + Styled Components](gatsby.md)
- Next.js + Styled Components (current)
