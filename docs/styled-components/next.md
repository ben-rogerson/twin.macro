# Use Twin with Next + Styled Components

**🔥 View the [Next + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/next-tailwind-styled-components-starter-m1f6d) for setup and usage examples**

## TypeScript

Twin comes with built-in TypeScript types for `tw`.
To support Twin's `css` and `styled` imports, check out our [Styled Components + TypeScript guide](typescript.md) once you've finished with the installation below.

## Installation

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

### 4. Configure Twin to use Styled Components

Add the config to your `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    "preset": "styled-components"
  }
},
```

<details>
  <summary>Alternatively add config to babel-plugin-macros.config.js</summary>

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    preset: 'styled-components',
  },
}
```

</details>

### Basic usage example

```js
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [Next + Styled Component + Tailwind Twin starter](https://codesandbox.io/s/next-tailwind-styled-components-starter-m1f6d).

## Other installation guides

- ["Vanilla" React + Styled Components](react.md)
- [Create React App + Styled Components](create-react-app.md)
- [Gatsby + Styled Components](gatsby.md)
