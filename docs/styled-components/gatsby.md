# Use Twin with Gatsby + Styled Components

**🔥 View the [Gatsby + Styled Components + Tailwind Twin starter](https://codesandbox.io/embed/gatsby-tailwind-styled-components-starter-trrlp?module=%2Fsrc%2Fpages%2Findex.js) for setup and usage examples**

## TypeScript

Twin comes with built-in TypeScript types for `tw`.
To support Twin's `css` and `styled` imports, check out our [Styled Components + TypeScript guide](typescript.md) once you've finished with the installation below.

## Installation

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
import 'tailwindcss/dist/base.min.css'
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

More usage examples can be found in the [Gatsby + Styled Components + Tailwind Twin starter](https://codesandbox.io/embed/gatsby-tailwind-styled-components-starter-trrlp?module=%2Fsrc%2Fpages%2Findex.js).

## Configuration

<details>
  <summary>Customize the Tailwind classes</summary>

### Customize the Tailwind classes

For style customizations, you’ll need to add a `tailwind.config.js` in your project root.

> It’s important to know that you don’t need a `tailwind.config.js` to use Twin. You already have access to every class with every variant.
> Unlike Tailwind, twin.macro only generates styles for the classes you use. This means you don’t need to use additional tools like purgeCSS.

Choose from one of the following configs:

- a) Start with an empty config:

  ```js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {},
    },
  }
  ```

- b) Start with a [full config](https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/defaultConfig.stub.js):

  ```bash
  # cd into your project folder then:
  curl https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/defaultConfig.stub.js > tailwind.config.js
  ```

  In the config, there only needs to be a `theme: {...}` entry so feel free to cleanup.

### Working with the config

You can overwrite or extend classes the same way as Tailwind.<br/>
Overwrite parts of the base config in `theme: { ... }` and extend in `theme: { extend: { ... } }`.<br/>
Read more in the [Tailwind theme docs](https://tailwindcss.com/docs/theme).

<hr />

</details>

<details>
  <summary>Configure Twin</summary>

### Configure Twin

These options can be added to your `package.json`:

```js
// package.json
"babelMacros": {
    "twin": {
      "config": "./tailwind.config.js",
      "preset": "styled-components",
      "autoCssProp": false,
      "hasSuggestions": true,
      "debug": false,
    }
},
```

Alternatively add the config to `babel-plugin-macros.config.js` in your project root:

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: './tailwind.config.js',
    preset: 'styled-components',
    autoCssProp: false,
    hasSuggestions: true,
    debug: false,
  },
}
```

| Name           | Type      | Default                  | Description                                                                                                                                                                                                              |
| -------------- | --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| config         | `string`  | `"./tailwind.config.js"` | The path to your Tailwind config                                                                                                                                                                                         |
| preset         | `string`  | `emotion`                | The css-in-js library to use behind the scenes - you should set this to `styled-components`                                                                                                                              |
| hasSuggestions | `boolean` | `true`                   | Display class suggestions when a class can't be found                                                                                                                                                                    |
| debug          | `boolean` | `false`                  | Display information about the Tailwind class conversions                                                                                                                                                                 |
| autoCssProp    | `boolean` | `false`                  | This code automates the import of 'styled-components/macro' so you can use their css prop. Enable it if you're using styled-components with CRA or Vanilla React. If you're using Emotion, setting to true does nothing. |

If Twin's default `styled` and `css` imports need to be adjusted, you can do so with the following config:<br/>

```js
{
  styled: { import: "default", from: "styled-components" },
  css: { import: "css", from: "styled-components/macro" }
}
```

**Note:** Make sure you remove the `preset` option as that value disables the styled + css options.

<hr />

</details>

## Styled components resources

- [The css prop](https://styled-components.com/docs/api#css-prop)
- [The css import](https://styled-components.com/docs/api#css)
- [The styled import](https://styled-components.com/docs/api#styled)

## Other installation guides

- ["Vanilla" React + Styled Components](react.md)
- [Create React App + Styled Components](create-react-app.md)
- [Next.js + Styled Components](next.md)
