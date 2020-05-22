# Using Twin with 'Vanilla' React + Emotion

**🔥 View the [React + Emotion + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-emotion-starter-3d1dl) for setup and usage examples**

### 1. Install the dependencies

```bash
# React and Babel
npm install --save react react-dom @babel/core @babel/plugin-transform-react-jsx @emotion/babel-plugin-jsx-pragmatic babel-plugin-macros
# Twin and Emotion
npm install --save twin.macro @emotion/core @emotion/styled
```

<details>
  <summary>Yarn instructions</summary>

```bash
# React and Babel
yarn add react react-dom @babel/core @babel/plugin-transform-react-jsx babel-plugin-macros
# Twin and Emotion
yarn add twin.macro @emotion/core @emotion/styled
```

</details>

### 2. Enable babel macros and jsx

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

> Note: After build, if you’re seeing "process is not defined" then npm install and add `"babel-plugin-transform-inline-environment-variables"` to .babelrc

### 3. Import the Tailwind base styles

Add the following to your `app.js` or `index.js`:
(the dependency 'tailwindcss' is already in your node_modules)

```js
// In your App.js or index.js entry
import 'tailwindcss/dist/base.css'
```

### Basic usage example

```js
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [React + Emotion + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-emotion-starter-3d1dl).

<hr />
