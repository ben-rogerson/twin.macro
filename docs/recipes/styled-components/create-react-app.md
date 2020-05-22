# Using Twin with Create React App + Styled Components

**🔥 View the [CRA + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-styled-components-starter-m8cyz) for setup and usage examples**

**:exclamation: If you are using _TypeScript_ you should also check out [the module annotation instructions](../../typesript/module-augmentation.md)**

### 1. Install Create React App

```bash
npx create-react-app my-app
```

### 2. Install the dependencies

```bash
npm install --save twin.macro styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro styled-components
```

</details>

### 3. Import the Tailwind base styles

Add the following to your `app.js` or `index.js`:
(the dependency 'tailwindcss' is already in your node_modules)

```js
// In your App.js or index.js entry
import 'tailwindcss/dist/base.css'
```

### 4. Configure Twin to use Styled Components

Place tailwind.config.js in the `src` folder. This allows it to be imported by a theme provider:

```js
// package.json
"babelMacros": {
  "twin": {
    "preset": "styled-components",
    "config": "src/tailwind.config.js",
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
    config: 'src/tailwind.config.js',
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

More usage examples can be found in the [CRA + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-styled-components-starter-m8cyz).
