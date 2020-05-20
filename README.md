<p align="center">
  <img src="https://i.imgur.com/iWBWhY0.png" alt="emotion" width="360" height="135"><br>
    <br>Use Tailwind classes within css-in-js libraries<br><br>
    <a href="https://www.npmjs.com/package/twin.macro"><img src="https://img.shields.io/npm/dt/twin.macro.svg" alt="Total Downloads"></a>
    <a href="https://www.npmjs.com/package/twin.macro"><img src="https://img.shields.io/npm/v/twin.macro.svg" alt="Latest Release"></a>
    <a href="https://discord.gg/n8ZhNSb"><img src="https://img.shields.io/discord/705884695400939552?label=discord&logo=discord" alt="Discord"></a>
</p>

---

Use Twin's `tw` prop to add Tailwind classes onto jsx elements:

```js
import 'twin.macro'

export default () => <input tw="border hover:border-black" />
```

Create and style new elements using tw:

```js
import tw from 'twin.macro'

const Input = tw.input`border hover:border-black`
export default () => <Input />
```

Clone and style existing components:

```js
const PurpleInput = tw(Input)`border-purple-500`
```

Add conditional styling and vanilla css with the styled import:

```js
import { tw, styled } from 'twin.macro'

const Input = styled.input`
  ${({ hasHover }) => hasHover && tw`hover:border-black`}
  ${tw`border`}
  color: purple;
`
export default () => <Input hasHover />
```

Add conditional styles on jsx elements with the css prop and import:

```js
import { tw, css } from 'twin.macro'

const Input = ({ hasDarkHover }) => (
  <input
    css={[
      ({ hasHover }) => hasHover && tw`hover:border-black`,
      tw`border`,
      css`
        color: white;
      `,
    ]}
  />
)
export default () => <Input hasDarkHover />
```

## How it works

When babel runs over your code, Twin's `css` and `styled` imports are swapped with the real imports from libraries like [👩‍🎤 emotion](https://emotion.sh/docs/introduction) and [💅 styled-components](https://styled-components.com/). Emotion is used by default.

Your tailwind classes are converted into css objects which are accepted by most css-in-js libraries:

```js
import tw from 'twin.macro'
tw`text-sm md:text-lg`

// ↓ ↓ ↓ ↓ ↓ ↓

(
  {
    fontSize: '0.875rem',
    '@media (min-width: 768px)': {
      fontSize: '1.125rem',
    },
  }
)
```

For usage examples in popular frameworks, head down to the [installation section](#installation).

## Features

**🎨 Style with all classes and variants from [Tailwind v1.4.0](https://github.com/tailwindcss/tailwindcss/releases/tag/v1.4.0) (May 2020)**

**🚥 All variants pre-enabled** - [Every variant](https://github.com/ben-rogerson/twin.macro/blob/master/src/config/variantConfig.js#L1) is at your fingertips so you can focus more on styling and less on configuration

**🐹 Adds no size to your build** - Twin converts classes you’ve used into css objects using Babel and then compiles itself away, no runtime required

**🛎 Helpful suggestions for mistypings** - Twin chimes in with class and variant values from your Tailwind config:

```bash
✕ ml-7 was not found

Try one of these classes:
ml-0 [0] / ml-1 [0.25rem] / ml-2 [0.5rem] / ml-3 [0.75rem] / ml-4 [1rem] / ml-5 [1.25rem] / ml-6 [1.5rem]
ml-8 [2rem] / ml-10 [2.5rem] / ml-12 [3rem] / ml-16 [4rem] / ml-20 [5rem] / ml-24 [6rem] / ml-32 [8rem]
ml-40 [10rem] / ml-48 [12rem] / ml-56 [14rem] / ml-64 [16rem] / ml-auto [auto] / ml-px [1px]
```

**💥 Go important with a bang** - Add important to any class with a trailing bang!

```js
tw`hidden!`
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
{ "display": "none !important" }
```

## Plugins

Twin supports [adding custom utilities](https://tailwindcss.com/docs/plugins/#adding-utilities) with further [plugin support underway](https://github.com/ben-rogerson/twin.macro/issues/7).

<details>
  <summary>How to add custom utilities</summary>

```js
// In your tailwind.config.js
module.exports = {
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.hotpink': {
          color: 'hotpink',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
```

</details>

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
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [Gatsby + Emotion + Tailwind Twin starter](https://codesandbox.io/s/gatsby-tailwind-emotion-starter-z3hun).

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
import 'twin.macro'
export default () => <button tw="text-lg px-8 py-2 rounded">Success</button>
```

More usage examples can be found in the [Next + Emotion + Tailwind Twin starter](hhttps://codesandbox.io/s/next-tailwind-emotion-starter-8h2b2).

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

More usage examples can be found in the [Next + Styled Component + Tailwind Twin starter](https://codesandbox.io/s/next-tailwind-styled-components-starter-m1f6d).

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

These defaults can be added to your `package.json`:

```js
// package.json
"babelMacros": {
    "twin": {
      "config": "./tailwind.config.js",
      "preset": "emotion",
      "hasSuggestions": true,
      "debug": false,
      "autoCssProp": false,
    }
},
```

Alternatively add the config to `babel-plugin-macros.config.js` in your project root:

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: './tailwind.config.js',
    preset: 'emotion',
    hasSuggestions: true,
    debug: false,
    autoCssProp: false,
  },
}
```

| Name           | Type      | Default                  | Description                                                                                                                                                                                                              |
| -------------- | --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| config         | `string`  | `"./tailwind.config.js"` | The path to your Tailwind config                                                                                                                                                                                         |
| preset         | `string`  | `emotion`                | The css-in-js library to use behind the scenes\* - usually this is set to `styled-components`                                                                                                                            |
| hasSuggestions | `boolean` | `true`                   | Display class suggestions when a class can't be found                                                                                                                                                                    |
| debug          | `boolean` | `false`                  | Display information about the Tailwind class conversions                                                                                                                                                                 |
| autoCssProp    | `boolean` | `false`                  | This code automates the import of 'styled-components/macro' so you can use their css prop. Enable it if you're using styled-components with CRA or Vanilla React. If you're using Emotion, setting to true does nothing. |

- For tuning your imports, replace `preset` with the config keys `styled` and `css`.<br/>
  eg: `styled: { import: "default", from: "@emotion/styled" }`

<hr />

</details>

Twin comes packed with built-in TypeScript types. For additional features take a look at [typescript-plugin-tw-template](https://github.com/kingdaro/typescript-plugin-tw-template).

## Community

Join us in the [Twin Discord](https://discord.gg/n8ZhNSb) for announcements, help and styling chat.

## Resources

- [Nerdcave’s Tailwind cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind documentation](https://tailwindcss.com/docs/installation)

## Special thanks

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a big shout out goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with tailwind.macro has been such a pleasure.
