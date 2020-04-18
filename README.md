<p align="center">
  <img src="https://i.imgur.com/iWBWhY0.png" alt="emotion" width="360" height="135">
  <h1 align="center">twin</h1>
</p>

Use Twin's `tw` prop to add Tailwind styles on jsx elements:

```js
import React from 'react'
import tw from 'twin.macro'

export default () => <input tw="border hover:border-black" />
```

Or use `tw.` to define new elements and add styles:

```js
import React from 'react'
import tw from 'twin.macro'

const Input = tw.input`border hover:border-black`
export default () => <Input />
```

For features like conditional styling and css blocks, Twin works with styling libraries like [👩‍🎤 emotion](https://emotion.sh/docs/introduction) or [💅 styled-components](https://styled-components.com/):

```js
import React from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled/macro'
import { css } from '@emotion/core'

const Input = styled.input([
  tw`border`,
  ({ hasDarkHover }) =>
    hasDarkHover
      ? tw`hover:border-black`
      : css`
          &:hover {
            ${tw`border-white`}
          }
        `,
])
export default () => <Input hasDarkHover />
```

But if you'd rather style on jsx elements then use a css prop:

```js
import React from 'react'
import { css } from '@emotion/core'
import tw from 'twin.macro'

const Input = ({ hasDarkHover }) => (
  <input
    css={[
      tw`border`,
      hasDarkHover
        ? tw`hover:border-black`
        : css`
            &:hover {
              ${tw`border-white`}
            }
          `,
    ]}
  />
)
export default () => <Input hasDarkHover />
```

For more examples, head down to the [installation section](#installation).

## Features

**👍 Supports Tailwind v1.2.0** - All classes are available (except [container](https://tailwindcss.com/docs/container)) with support for [custom utility plugins](https://tailwindcss.com/docs/plugins/#adding-utilities)

**🙅🏻 No PurgeCSS required** - Unlike Tailwind, there's no need to pre-generate a css file with all the possible styles. Instead, Twin converts used Tailwind classes into css object styles using Babel

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
{ "display": "none !important" }
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

### [Emotion](https://emotion.sh/docs/introduction) (default)

<details>
  <summary>Gatsby</summary>

## Gatsby + Emotion

**🔥 View the [Gatsby + Emotion + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-emotion-starter-z3hun) for setup and usage examples**

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
  plugins: [`gatsby-plugin-emotion`],
}
```

### Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [Gatsby + Emotion + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-emotion-starter-z3hun).

<hr />

</details>

<details>
  <summary>Create React App</summary>

## Create React App + Emotion

**🔥 View the [CRA + Emotion + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-emotion-starter-bi1kx) for setup and usage examples**

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
// (the dependency 'tailwindcss' is already in your node_modules)
import 'tailwindcss/dist/base.css'
```

### 4. Configure custom config location

Add the config to your `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    // Place tailwind.config.js in the src folder so
    // it can be imported into your theme provider
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
    // Place tailwind.config.js in the src folder so
    // it can be imported into your theme provider
    config: 'src/tailwind.config.js',
  },
}
```

</details>

### Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [CRA + Emotion + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-emotion-starter-bi1kx).

<hr />

</details>

<details>
  <summary>Next</summary>

## Next + Emotion

**🔥 View the [Next + Emotion + Tailwind Twin starter](https://codesandbox.io/s/next-tailwind-emotion-starter-8h2b2) for setup and usage examples**

### 1. Install the dependencies

After creating your next app:

```bash
npm install -D twin.macro @emotion/core @emotion/styled @emotion/babel-preset-css-prop
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro @emotion/core @emotion/styled @emotion/babel-preset-css-prop -D
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
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [Next + Emotion + Tailwind Twin starter](hhttps://codesandbox.io/s/next-tailwind-emotion-starter-8h2b2).

<hr />

</details>

<details>
  <summary>React</summary>

## React + Emotion

**🔥 View the [React + Emotion + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-emotion-starter-3d1dl) for setup and usage examples**

### 1. Install the dependencies

```bash
# React and Babel
npm install -D react react-dom @babel/core @babel/plugin-transform-react-jsx babel-plugin-macros
# Twin and Emotion
npm install -D twin.macro @emotion/core @emotion/styled
```

<details>
  <summary>Yarn instructions</summary>

```bash
# React and Babel
yarn add react react-dom @babel/core @babel/plugin-transform-react-jsx babel-plugin-macros -D
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

> Note: After build, if you’re seeing "process is not defined" then npm install and add `"babel-plugin-transform-inline-environment-variables"` to .babelrc

### 3. Import the Tailwind base styles

```js
// In your App.js or index.js entry
// (the dependency 'tailwindcss' is already in your node_modules)
import 'tailwindcss/dist/base.css'
```

### Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [React + Emotion + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-emotion-starter-3d1dl).

<hr />

</details>

### [Styled Components](https://styled-components.com/)

<details>
  <summary>Gatsby</summary>

## Gatsby + Styled Components

**🔥 View the [Gatsby + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-styled-components-starter-trrlp) for setup and usage examples**

### 1. Install Gatsby

```bash
npx gatsby new gatsby-site
```

### 2. Install the dependencies

```bash
npm install -D twin.macro styled-components gatsby-plugin-styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro styled-components gatsby-plugin-styled-components -D
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
  plugins: [`gatsby-plugin-styled-components`],
}
```

### 5. Configure twin to use styled components

Add the config to your `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    "styled": "styled-components"
  }
},
```

<details>
  <summary>Alternatively add config to babel-plugin-macros.config.js</summary>

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    styled: 'styled-components',
  },
}
```

</details>

### Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [Gatsby + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-styled-components-starter-trrlp).

<hr />

</details>

<details>
  <summary>Create React App</summary>

## Create React App + Styled Components

**🔥 View the [CRA + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-styled-components-starter-m8cyz) for setup and usage examples**

### 1. Install Create React App

```bash
npx create-react-app my-app
```

### 2. Install the dependencies

```bash
npm install -D twin.macro styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro styled-components -D
```

</details>

### 3. Import the Tailwind base styles

```js
// In your App.js or index.js entry
// (the dependency 'tailwindcss' is already in your node_modules)
import 'tailwindcss/dist/base.css'
```

### 4. Configure twin to use styled components

Add the config to your `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    "styled": "styled-components",
    // Place tailwind.config.js in the src folder so
    // it can be imported into your theme provider
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
    styled: 'styled-components',
    // Place tailwind.config.js in the src folder so
    // it can be imported into your theme provider
    config: 'src/tailwind.config.js',
  },
}
```

</details>

### Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [CRA + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/cra-tailwind-styled-components-starter-m8cyz).

<hr />

</details>

<details>
  <summary>Next</summary>

## Next + Styled Components

**🔥 View the [Next + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/next-tailwind-styled-components-starter-m1f6d) for setup and usage examples**

### 1. Install the dependencies

After creating your next app:

```bash
npm install -D twin.macro styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
yarn add twin.macro styled-components -D
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
import 'tailwindcss/dist/base.css'

const App = ({ Component, pageProps }) => <Component {...pageProps} />

export default App
```

### Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [Next + Styled Component + Tailwind Twin starter](https://codesandbox.io/s/next-tailwind-styled-components-starter-m1f6d).

<hr />

</details>

<details>
  <summary>React</summary>

## React + Styled Components

**🔥 View the [React + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-styled-components-starter-f87y7) for setup and usage examples**

### 1. Install the dependencies

```bash
# React and Babel
npm install -D react react-dom @babel/core @babel/plugin-transform-react-jsx
# Twin and Styled Components
npm install -D twin.macro styled-components
```

<details>
  <summary>Yarn instructions</summary>

```bash
# React and Babel
yarn add react react-dom @babel/core -D
# Twin and Styled Components
yarn add twin.macro styled-components -D
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

```js
// In your App.js or index.js entry
// (the dependency 'tailwindcss' is already in your node_modules)
import 'tailwindcss/dist/base.css'
```

### 4. Configure twin to use styled components

Add the config to your `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    "styled": "styled-components"
  }
},
```

<details>
  <summary>Alternatively add config to babel-plugin-macros.config.js</summary>

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    styled: 'styled-components',
  },
}
```

</details>

### Basic usage example

```js
import tw from 'twin.macro'
const Button = tw.button`text-lg px-8 py-2 rounded`
const SuccessButton = () => <Button>Success</Button>
```

More usage examples can be found in the [React + Styled Components + Tailwind Twin starter](https://codesandbox.io/s/react-tailwind-styled-components-starter-f87y7).

<hr />

</details>

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

Add the default config to your `package.json` and tweak:

```js
// package.json
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

Alternatively add the config to `babel-plugin-macros.config.js` in your project root:

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: './tailwind.config.js',
    styled: '@emotion/styled',
    format: 'auto',
    hasSuggestions: true,
    debug: false,
  },
}
```

| Name           | Type                 | Default                  | Description                                                                                                                                          |
| -------------- | -------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| config         | `string`             | `"./tailwind.config.js"` | The path to your Tailwind config                                                                                                                     |
| styled         | `string` or `object` | `"@emotion/styled"`      | The css-in-js library to import behind the scenes when using `tw`. For more options, use an object: `{ import: "default", from: "@emotion/styled" }` |
| format         | `string`             | `"auto"`                 | CSS output format. Output can be an object except when inside a `<style>` element. `"object"`, `"string"`, or `"auto"`                               |
| hasSuggestions | `boolean`            | `true`                   | Display class suggestions when a class can't be found                                                                                                |
| debug          | `boolean`            | `false`                  | Display information about the Tailwind class conversions                                                                                             |

<hr />

</details>

## TypeScript support

Twin comes with built-in TypeScript types. For additional features take a look at [typescript-plugin-tw-template](https://github.com/kingdaro/typescript-plugin-tw-template).

## Resources

- [Nerdcave’s Tailwind cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind documentation](https://tailwindcss.com/docs/installation)

## Special thanks

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a big shout out goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with tailwind.macro has been such a pleasure.
