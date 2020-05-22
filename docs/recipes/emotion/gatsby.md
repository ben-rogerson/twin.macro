# Using Twin with Gatsby + Emotion

**🔥 View the [Gatsby + Emotion + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-emotion-starter-z3hun) for setup and usage examples**

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

### 3. Import the Tailwind base styles

```js
// gatsby-browser.js
import 'tailwindcss/dist/base.css'
```

### 4. Enable the Gatsby emotion plugin

```js
// gatsby-config.js
module.exports = {
  plugins: [`gatsby-plugin-emotion`],
}
```

### Basic usage example

```js
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [Gatsby + Emotion + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-emotion-starter-z3hun).

<hr />
