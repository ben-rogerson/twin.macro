## Using Twin with Next + Emotion

**🔥 View the [Next + Emotion + Tailwind Twin starter](https://codesandbox.io/s/next-tailwind-emotion-starter-8h2b2) for setup and usage examples**

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
import 'tailwindcss/dist/base.css'

const App = ({ Component, pageProps }) => <Component {...pageProps} />

export default App
```

### Basic usage example

```js
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [Next + Emotion + Tailwind Twin starter](hhttps://codesandbox.io/s/next-tailwind-emotion-starter-8h2b2).
