<p align="center">
  <img src="https://i.imgur.com/iWBWhY0.png" alt="emotion" height="120" width="320">
  <h1 align="center">twin.macro</h1>
</p>
<p align="center" style="font-size: 1.3rem;">Use Tailwind classes within any CSS-in-JS library<br /></p>

```js
// In
import tw from 'twin.macro'
const buttonStyles = tw`bg-purple-700 text-sm`
```

```js
// Out
const buttonStyles = {
  backgroundColor: '#6b46c1',
  fontSize: '0.875rem'
}
```

## Install

### 1. Install the dependencies

```bash
npm install -D twin.macro babel-plugin-macros
# or
yarn add twin.macro babel-plugin-macros -D
```

>

### 2. Enable babel macros

Twin requires the macros plugin to be added in the babel config:

```js
// In .babelrc
{
  "plugins": ["macros"]
}
```

### 3. Add a CSS-in-JS library

<details>
  <summary>Emotion (default)</summary>

## [Emotion](https://github.com/emotion-js/emotion)

#### Getting started

```bash
npm install -D @emotion/core @emotion/styled
# or
yarn add @emotion/core @emotion/styled -D
```

#### Basic example

```js
import tw from 'twin.macro'
import { css } from '@emotion/core'

const style = css(tw`font-mono text-sm text-red-500 hover:text-blue-500`)

const Button = () => <button {...style}>Success</button>
```

#### React example

```js
import React from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled/macro'
import { css } from '@emotion/core'

// Use the tw operator to create elements and style them,
// this will keep your classes on a single line.
const BtnPrimary = tw.button`text-white hover:focus:bg-black`

// When you need to use vanilla css then use styled to create
// the element and use tw inside the backticks to add your classes.
const BtnSecondary = styled.button`
  ${tw`text-white bg-blue-500`}
  &:hover, &:focus {
    ${tw`bg-black`}
  }
`

// When working with conditional props in styled you can use tw or css
// This example passes in the props to be used anywhere within the backticks
const BtnTertiary = styled.button(
  ({ isSmall, isExtraPadded }) => css`
    font-size: 1em;
    ${isSmall && tw`text-sm`}

    ${isExtraPadded
      ? tw`px-12 py-8`
      : css`
          padding: 5px 10px;
        `}
  `
)

// Alternatively, props can also be passed in on the line you need them
const BtnTertiary = styled.button`
  // These two lines are equivalent:
  ${({ isSmall }) => isSmall && tw`text-sm`}
  ${props => props.isSmall && tw`text-sm`}
`

const ButtonSet = () => (
  <>
    <BtnPrimary>Submit</BtnPrimary>
    <BtnSecondary>Cancel</BtnSecondary>
    <BtnTertiary isSmall isExtraPadded>
      Cancel
    </BtnTertiary>
  </>
)
```

<hr />

</details>

<details>
  <summary>Glamor</summary>

### [Glamor](https://github.com/threepointone/glamor)

```js
import { css } from 'glamor'
import tw from 'twin.macro'

const style = css(tw`font-mono text-sm text-red-500 hover:text-blue-500`)

const App = () => <div {...style}>Success</div>
```

<hr />
</details>

<details>
  <summary>Styled-jsx</summary>

### [Styled-jsx](https://github.com/zeit/styled-jsx)

```js
import tw from 'twin.macro'

const App = () => (
  <div>
    <button className="button">Success</button>
    <style jsx>{`
      .button {
        ${tw`font-mono text-sm text-red-500 hover:text-blue-500`}
      }
    `}</style>
  </div>
)
```

When used inside a `<style>` element the tagged template literal (``) is transformed into a CSS string.

Also, when using `hover:*`, `focus:*`, or media query (e.g. `sm:*`) class names the output is nested. Use [styled-jsx-plugin-postcss](https://github.com/giuseppeg/styled-jsx-plugin-postcss) and [postcss-nested](https://github.com/postcss/postcss-nested) to allow nesting.

<hr />
</details>

## Configation

<details>
  <summary>Customise the tailwind classes</summary>
<br>

> It’s important to know that you don’t need a `tailwind.config.js` to use Twin. You already have access to every class with every variant.
> Unlike Tailwind, twin.macro only generates styles for the classes you use. This means you don’t need to use additional tools like purgeCSS.

Customising classes is done in `tailwind.config.js`.<br/>Here's two types of configs to get you started:<br/>

a) Add the [simple config](https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/simpleConfig.stub.js)

```bash
curl https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/simpleConfig.stub.js > tailwind.config.js
```

b) Add the [full config](https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/defaultConfig.stub.js)

```bash
curl https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/defaultConfig.stub.js > tailwind.config.js
```

In the config, there only needs to be a `theme: {...}` entry so feel free to cleanup.

You can overwrite or extend classes the same way as Tailwind.<br/>
Overwrite parts of the base config in `theme: { ... }` and xtend in `theme: { extend: { ... } }`.<br/>
Read more in the [Tailwind theme docs](https://tailwindcss.com/docs/theme).

</details>

<details>
  <summary>Configure twin.macro</summary>
<br>

Create a `babel-plugin-macros.config.js` in your project root to configure twin.macro.

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: './tailwind.config.js',
    styled: '@emotion/styled',
    format: 'auto',
    debug: false
  }
}
```

| Name   | Type      | Default                  | Description                                                                                                            |
| ------ | --------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| config | `string`  | `"./tailwind.config.js"` | The path to your tailwind config                                                                                       |
| styled | `string`  | `"@emotion/styled"`      | The css-in-js library to import behind the scenes when using `tw`                                                      |
| format | `string`  | `"auto"`                 | CSS output format. Output can be an object except when inside a `<style>` element. `"object"`, `"string"`, or `"auto"` |
| debug  | `boolean` | `false`                  | Display information about the Tailwind class conversions                                                               |

</details>

## Roadmap

- Support the `transform` class
- Support the `container` class
- Improve vanilla css usage alongside the `tw` macro
- Add instructions on how to setup css syntax highlighting
- Add `!important` styling
- Improve and add more usage examples
- Have an idea? I’d love to hear it [in an issue](https://github.com/ben-rogerson/twin.macro/issues)

## Sick picks

- [Nerdcave's Tailwind cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind documentation](https://tailwindcss.com/docs/installation)

## Code credits

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a very special thanks goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with the `tw` macro has been such a pleasure.
