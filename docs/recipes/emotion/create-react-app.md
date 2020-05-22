# Using Twin with Create React App + Emotion

**🔥 View the [CRA + Emotion + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-emotion-starter-bi1kx) for setup and usage examples**

**:exclamation: If you are using _TypeScript_ you should also check out [the module annotation instructions](../../typesript/module-annotation.md)**

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

### 3. Import the Tailwind base styles

Add the following to your `app.js` or `index.js`:
(the dependency 'tailwindcss' is already in your node_modules)

```js
// In your App.js or index.js entry
import 'tailwindcss/dist/base.css'
```

### 4. Configure custom config location

Place tailwind.config.js in the `src` folder. This allows it to be imported by a theme provider:

```js
// package.json
"babelMacros": {
  "twin": {
    "config": "src/tailwind.config.js"
  }
},
```

<details>
  <summary>Alternatively add config to babel-plugin-macros.config.js</summary>

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: 'src/tailwind.config.js',
  },
}
```

</details>

### Basic usage example

```js
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [CRA + Emotion + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-emotion-starter-bi1kx).

<hr />
