# Use Twin with Gatsby + Emotion

**🔥 View the [Gatsby + Emotion + Tailwind Twin starter](https://codesandbox.io/embed/gatsby-tailwind-emotion-starter-z3hun?module=%2Fsrc%2Fpages%2Findex.js) for usage examples**

## Getting started

### 1. Install Gatsby

```bash
npx gatsby new gatsby-site
```

### 2. Install the dependencies

```bash
npm install --save twin.macro @emotion/core @emotion/styled gatsby-plugin-emotion
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro @emotion/core @emotion/styled gatsby-plugin-emotion
```

</details>

### 3. Add gatsby-plugin-emotion to the gatsby config

```js
// gatsby-config.js
module.exports = {
  plugins: [`gatsby-plugin-emotion`],
}
```

### 4. Add the global styles

Projects using Twin also use the Tailwind [preflight base styles](https://unpkg.com/tailwindcss/dist/base.css) to smooth over cross-browser inconsistencies.

Twin adds the preflight base styles with the `GlobalStyles` import which you can add to a layout file in `src/components/Layout.js`:

```js
// src/components/Layout.js
import React from 'react'
import { GlobalStyles } from 'twin.macro'

const Layout = ({ children }) => (
  <>
    <GlobalStyles />
    {children}
  </>
)

export default Layout
```

Then in your pages, wrap your content with the layout:

```js
// src/pages/index.js
import Layout from './../components/Layout'

const App = () => <Layout>{/* ... */}</Layout>
```

`GlobalStyles` also includes some [@keyframes](https://github.com/ben-rogerson/twin.macro/blob/master/src/config/globalStyles.js) so the `animate-xxx` classes have animations. But if you’re not using the animate classes then you can [avoid adding the extra keyframes](https://github.com/ben-rogerson/twin.macro/blob/master/docs/extra-keyframes.md).

### 5. Add the recommended config

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
- Gatsby + Emotion (current)
- [Next.js + Emotion](next.md)
