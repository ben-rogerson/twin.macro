<p align="center">
  <img src="https://i.imgur.com/iWBWhY0.png" alt="emotion" width="360" height="135">
  <h1 align="center">twin</h1>
</p>
<p align="center">Use Tailwind classes within any CSS-in-JS library<br /></p>

```js
import tw from "twin.macro"
const styles = tw`text-2xl bg-purple-700 hover:bg-purple-400 lg:bg-pink-500`

// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓

const styles = {
  "fontSize": "1.5rem",
  "backgroundColor": "#6b46c1",
  ":hover": {
    "backgroundColor": "#b794f4"
  },
  "@media (min-width: 1024px)": {
    "backgroundColor": "#ed64a6"
  }
}
```
## About

Twin converts [Tailwind](https://tailwindcss.com) classes into CSS style objects that any CSS-in-JS library can use. 
This includes popular libraries like: [Emotion](https://emotion.sh/docs/introduction), [Styled Components](https://styled-components.com/) and [Styled JSX](https://github.com/zeit/styled-jsx).

Twin supports all Tailwind v1.2.0 classes (except [container](https://tailwindcss.com/docs/container)) and also supports [custom utility classes](https://tailwindcss.com/docs/plugins/#adding-utilities) added as plugins.

## Extra features

**🛎 Helpful suggestions for mistypings** - Twin chimes in with class and variant examples from your Tailwind config:

```bash
✕ ml-7 was not found

Try one of these classes:
ml-0 [0] / ml-1 [0.25rem] / ml-2 [0.5rem] / ml-3 [0.75rem] / ml-4 [1rem] / ml-5 [1.25rem] / ml-6 [1.5rem]
ml-8 [2rem] / ml-10 [2.5rem] / ml-12 [3rem] / ml-16 [4rem] / ml-20 [5rem] / ml-24 [6rem] / ml-32 [8rem]
ml-40 [10rem] / ml-48 [12rem] / ml-56 [14rem] / ml-64 [16rem] / ml-auto [auto] / ml-px [1px]
```


**🎲 Bring before and after elements to the game** - Style `::before` and `::after` pseudo-elements with custom variants:
```js
tw`before:content before:block after:content after:w-10`
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
{
  ":before": {
    "content": "\"\"",
    "display": "block"
  },
  ":after": {
    "content": "\"\"",
    "width": "2.5rem"
  }
}
```

**💥 Go important with a bang** - Add important to any class with a trailing bang!
```js
tw`hidden!`
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
{ "display": "hidden !important" }
```

**🎩 A focus on hocus** - Style elements on hover + focus with one magic-sounding `hocus:` variant:
```js
tw`hocus:bg-red-500`
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
{ ":hover, :focus": {
  "backgroundColor": "#f56565"
}}
```

## Installation

If you’re not sure which JavaScript styling library to use then try [Emotion](https://emotion.sh/docs/introduction) for it’s flexibility and rich features.<br/>
Here’s some installation examples:

<details>
  <summary>Gatsby + Twin + Emotion</summary>

## Gatsby + Twin + Emotion

**🔥 View the [Gatsby + Tailwind + Emotion starter](https://codesandbox.io/s/gatsby-tailwind-emotion-starter-z3hun) for setup and usage examples**

### 1. Install Gatsby

```bash
npx gatsby new gatsby-site
```

### 2. Install the dependencies

```bash
npm install -D twin.macro @emotion/core @emotion/styled gatsby-plugin-emotion
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro @emotion/core @emotion/styled gatsby-plugin-emotion -D
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
  plugins: [`gatsby-plugin-emotion`]
}
```

### 5. Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded bg-white text-green-500 border-green-500`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [Gatsby + Tailwind + Emotion starter](https://codesandbox.io/s/gatsby-tailwind-emotion-starter-z3hun).

<hr />

</details>

<details>
  <summary>Create React App + Twin + Emotion</summary>

## Create React App + Twin + Emotion

**🔥 View the [CRA + Tailwind + Emotion starter](https://codesandbox.io/s/cra-tailwind-emotion-starter-bi1kx) for setup and usage examples**

### 1. Install Create React App

```bash
npx create-react-app my-app
```

### 2. Install the dependencies

```bash
npm install -D twin.macro @emotion/core @emotion/styled
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro @emotion/core @emotion/styled -D
```

</details>

### 3. Import the Tailwind base styles

```js
// In your App.js or index.js entry
// (tailwindcss is pre-installed with twin.macro)
import 'tailwindcss/dist/base.css'
```

### 4. Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded bg-white text-green-500 border-green-500`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [CRA + Tailwind + Emotion starter](https://codesandbox.io/s/cra-tailwind-emotion-starter-bi1kx).

<hr />

</details>

<details>
  <summary>React + Twin + Emotion</summary>

## React + Twin + Emotion

**🔥 View the [React + Tailwind + Emotion starter](https://codesandbox.io/s/react-tailwind-emotion-starter-3d1dl) for setup and usage examples**

### 1. Install the dependencies

```bash
# React and Babel
npm install -D react react-dom @babel/plugin-transform-react-jsx @babel/core @babel/cli babel-plugin-macros
# Twin and Emotion
npm install -D twin.macro @emotion/core @emotion/styled
```

<details>
  <summary>Yarn instructions</summary>

```bash
# React and Babel
yarn add react react-dom @babel/plugin-transform-react-jsx @babel/core @babel/cli babel-plugin-macros -D
# Twin and Emotion
yarn add twin.macro @emotion/core @emotion/styled -D
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

>Note: If you’re using Parcel and seeing "process is not defined" then add `"transform-node-env-inline"` to the plugins list. [[Source]](https://github.com/parcel-bundler/parcel/issues/2470#issuecomment-468028575)

### 3. Import the Tailwind base styles

```js
// In your App.js or index.js entry
// (tailwindcss is pre-installed with twin.macro)
import 'tailwindcss/dist/base.css'
```

### 4. Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded bg-white text-green-500 border-green-500`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [React + Tailwind + Emotion starter](https://codesandbox.io/s/react-tailwind-emotion-starter-3d1dl).

<hr />

</details>

## Configuration

<details>
  <summary>Customise the tailwind classes</summary>

### Customise the tailwind classes

For any style customisation, you’ll need a `tailwind.config.js` in your project root.

> It’s important to know that you don’t need a `tailwind.config.js` to use Twin. You already have access to every class with every variant.
> Unlike Tailwind, twin.macro only generates styles for the classes you use. This means you don’t need to use additional tools like purgeCSS.

Choose from one of the following configs:

- Option a. Start with an empty config:

  ```js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {}
    }
  }
  ```

- Option b. Start with a [full config](https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/defaultConfig.stub.js):

  ```bash
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

Add a `babel-plugin-macros.config.js` in your project root or place the config in `package.json`:

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: './tailwind.config.js',
    styled: '@emotion/styled',
    format: 'auto',
    hasSuggestions: true,
    debug: false
  }
}

// or package.json
"babelMacros": {
    "twin": {
      "config": "./tailwind.config.js",
      "styled": "@emotion/styled",
      "format": "auto",
      "hasSuggestions": true,
      "debug": false
    }
},
```

| Name           | Type                 | Default                  | Description                                                                                                                                          |
| -------------- | -------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| config         | `string`             | `"./tailwind.config.js"` | The path to your tailwind config                                                                                                                     |
| styled         | `string` or `object` | `"@emotion/styled"`      | The css-in-js library to import behind the scenes when using `tw`. For more options, use an object: `{ import: "default", from: "@emotion/styled" }` |
| format         | `string`             | `"auto"`                 | CSS output format. Output can be an object except when inside a `<style>` element. `"object"`, `"string"`, or `"auto"`                               |
| hasSuggestions | `boolean`            | `true`                   | Display class suggestions when a class can't be found                                                                                                |
| debug          | `boolean`            | `false`                  | Display information about the Tailwind class conversions                                                                                             |

<hr />

</details>

## Roadmap

- [ ] Add further support for plugins
- [ ] Complete dev functions (production mode only at the moment)
- [ ] Add media query helpers
- [ ] Improve vanilla css syntax alongside `tw` macro
- [ ] Support the `container` class

Have an idea for a killer feature? Please [open an issue](https://github.com/ben-rogerson/twin.macro/issues), I'd love to hear from you.

## Resources

- [Nerdcave’s Tailwind cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind documentation](https://tailwindcss.com/docs/installation)

## Special thanks

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a big shout out goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with tailwind.macro has been such a pleasure.
