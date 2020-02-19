<p align="center">
  <img src="https://i.imgur.com/iWBWhY0.png" alt="emotion" height="120" width="320">
  <h1 align="center">twin.macro</h1>
</p>
<p align="center" style="font-size: 1.3rem;">Use Tailwind classes within any CSS-in-JS library<br /></p>

```js
// In
import tw from 'twin.macro'
const buttonStyles = tw`bg-purple-700 text-sm`

// Out
const buttonStyles = {
  backgroundColor: '#6b46c1',
  fontSize: '0.875rem'
}
```

```js
// In
import tw from 'twin.macro'
const button = tw.button`bg-purple-700 text-sm`

// Out
import _styled from '@emotion/styled'
const Box = _styled.div({
  backgroundColor: '#6b46c1',
  fontSize: '0.875rem'
})
```

## Install

#### 1. Install the dependencies

```bash
npm install -D twin.macro babel-plugin-macros
# or
yarn add twin.macro babel-plugin-macros -D
```

#### 2. Enable Babel macros in `.babelrc`

Enable Babel macros by adding "macros" to the plugin configuration:

```js
{
  "plugins": ["macros"]
}
```

## Configation

<details>
  <summary>Customise the classes</summary>
<br>

> It’s important to know that you don’t need a `tailwind.config.js` to use Twin. You already have access to every class with every variant.
> Unlike Tailwind, twin.macro only generates styles for the classes you use. This means you don’t need to use additional tools like purgeCSS.

Customising classes is done in `tailwind.config.js`.<br/>Here's two types of configs to get you started.:<br/>

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

`config`: path to your Tailwind config file. Defaults to `"./tailwind.config.js"`

`format`: CSS output format. `"object"`, `"string"`, or `"auto"` (default) – `"auto"` will cause the output to be an object except when inside a `<style>` element.

`debug`: Displays information about the Tailwind class conversions.

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    config: "./path/to/tailwind.config.js", // Default: "./tailwind.config.js"
    styled: "@emotion/styled", // Default: "@emotion/styled"
    format: "auto" // Options: "string", "auto"
    debug: true
  }
}
```

</details>

## Examples

<details>
  <summary>Emotion &amp; Styled Components (recommended)</summary>

### [Emotion](https://github.com/emotion-js/emotion) and [Styled Components](https://github.com/styled-components/styled-components)

#### Install the dependencies

```bash
npm install -D @emotion/core @emotion/styled
# or
yarn add @emotion/core @emotion/styled -D
```

#### Inline css prop example

```js
// Example.js
import { css } from '@emotion/core'
import styled from '@emotion/styled/macro'
import tw from 'tailwind.macro'

const stylesGreen = css(tw`text-green`)
const Button = () => <button css={stylesGreen}>hello, world</button>
```

####

```js
const ButtonPrimary = tw.button`text-white bg-green hover:bg-black focus:bg-black`
const ButtonSecondary = styled.button`
  ${tw`bg-red`}
  &:hover, &:focus {
    ${tw`bg-black`}
  }
`

const ButtonSet = () => (
  <>
    <ButtonPrimary>Submit</ButtonPrimary>
    <ButtonSecondary>Cancel</ButtonSecondary>
  </>
)
```

_Note: the `css` prop requires [babel-plugin-emotion](https://github.com/emotion-js/emotion/tree/master/packages/babel-plugin-emotion)._

```bash
npm i -D @emotion/core @emotion/styled
```

<hr />

</details>

<details>
  <summary>Glamor</summary>

### [Glamor](https://github.com/threepointone/glamor)

```js
import { css } from 'glamor'
import tw from 'tailwind.macro'

const style = css(tw`font-mono text-sm text-red hover:text-blue`)

const App = () => <div {...style}>hello, world</div>
```

<hr />
</details>

<details>
  <summary>Styled-jsx</summary>

### [Styled-jsx](https://github.com/zeit/styled-jsx)

```js
import tw from 'tailwind.macro'

const App = () => (
  <div>
    <div className="foo">hello, world</div>
    <style jsx>{`
      .foo {
        ${tw`font-mono text-sm text-red hover:text-blue`}
      }
    `}</style>
  </div>
)
```

When used inside a `<style>` element the tagged template literal (``) is transformed into a CSS string.

Also, when using `hover:*`, `focus:*`, or media query (e.g. `sm:*`) class names the output is nested. Use [styled-jsx-plugin-postcss](https://github.com/giuseppeg/styled-jsx-plugin-postcss) and [postcss-nested](https://github.com/postcss/postcss-nested) to allow nesting.

<hr />
</details>

## Roadmap

- Support the container class
- Improve vanilla css usage alongside the `tw` macro
- Add instructions on how to setup css syntax highlighting
- Have an idea? I’d love to hear it [in an issue](https://github.com/ben-rogerson/twin.macro/issues)

## Quick picks

- [Nerdcave's Tailwind cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind documentation](https://tailwindcss.com/docs/installation)

## Code credits

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a very special thanks goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with the `tw` macro has been such a pleasure.
