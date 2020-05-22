# Using Twin with 'Vanilla' React + Styled Components

**🔥 View the [React + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-styled-components-starter-f87y7) for setup and usage examples**

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
yarn add react react-dom @babel/core
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
import 'tailwindcss/dist/base.css'
```

### 4. Configure Twin to use Styled Components

Add the config to your `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    "preset": "styled-components",
    "autoCssProp": true, // This adds the css prop when it's needed
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
    autoCssProp: true, // This adds the css prop when it's needed
  },
}
```

</details>

### Basic usage example

```js
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [React + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-styled-components-starter-f87y7).
