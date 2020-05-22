# Using Twin with Gatsby + Styled Components

**🔥 View the [Gatsby + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-styled-components-starter-trrlp) for setup and usage examples**

**:exclamation: If you are using _TypeScript_ you should also check out [the module annotation instructions](../../typesript/module-annotation.md)**

### 1. Install Gatsby

```bash
npx gatsby new gatsby-site
```

### 2. Install the dependencies

```bash
npm install --save twin.macro styled-components gatsby-plugin-styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro styled-components gatsby-plugin-styled-components
```

</details>

### 3. Import the Tailwind base styles

```js
// gatsby-browser.js
import 'tailwindcss/dist/base.css'
```

### 4. Enable the Gatsby Styled Components plugin

```js
// gatsby-config.js
module.exports = {
  plugins: [`gatsby-plugin-styled-components`],
}
```

### 5. Configure Twin to use Styled Components

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

More usage examples can be found in the [Gatsby + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-styled-components-starter-trrlp).
