<p align="center">
  <img src="https://i.imgur.com/dIwewYI.png" alt="twin logo" width="360"><br>
    <br>Twin blends the magic of Tailwind with the flexibility of css-in-js<br><br>
    <a href="https://www.npmjs.com/package/twin.macro"><img src="https://img.shields.io/npm/dt/twin.macro.svg" alt="Total Downloads"></a>
    <a href="https://www.npmjs.com/package/twin.macro"><img src="https://img.shields.io/npm/v/twin.macro.svg" alt="Latest Release"></a>
    <a href="https://discord.gg/Xj6x9z7"><img src="https://img.shields.io/discord/705884695400939552?label=discord&logo=discord" alt="Discord"></a>
    <br>
    <br>
    <a href="https://codesandbox.io/embed/github/ben-rogerson/twin.examples/tree/master/react-styled-components?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark">Demo twin on CodeSandbox →</a>
</p>

---

Use Twin’s `tw` prop to add Tailwind classes onto jsx elements:

```js
import 'twin.macro'

const Input = () => <input tw="border hover:border-black" />
```

Nest Twin’s `tw` import within a css prop to add conditional styles:

```js
import tw from 'twin.macro'

const Input = ({ hasHover }) => (
  <input css={[tw`border`, hasHover && tw`hover:border-black`]} />
)
```

Or mix sass styles with the css import:

```js
import tw, { css } from 'twin.macro'

const hoverStyles = css`
  &:hover {
    border-color: black;
    ${tw`text-black`}
  }
`
const Input = ({ hasHover }) => (
  <input css={[tw`border`, hasHover && hoverStyles]} />
)
```

### Styled Components

You can also use the tw import to create and style new components:

```js
import tw from 'twin.macro'

const Input = tw.input`border hover:border-black`
```

And clone and style existing components:

```js
const PurpleInput = tw(Input)`border-purple-500`
```

Switch to the styled import to add conditional styling:

```js
import tw, { styled } from 'twin.macro'

const StyledInput = styled.input(({ hasBorder }) => [
  `color: black;`,
  hasBorder && tw`border-purple-500`,
])
const Input = () => <StyledInput hasBorder />
```

Or use backticks to mix with sass styles:

```js
import tw, { styled } from 'twin.macro'

const StyledInput = styled.input`
  color: black;
  ${({ hasBorder }) => hasBorder && tw`border-purple-500`}
`
const Input = () => <StyledInput hasBorder />
```

## How it works

When babel runs over your code, Twin’s `css` and `styled` imports get swapped with the real imports from libraries like [💅&nbsp;styled&#8209;components](https://styled-components.com/) and [👩‍🎤&nbsp;emotion](https://emotion.sh/docs/introduction).

Twin offers import presets for these libraries or you can fully customise the imports.

When you use `tw`, Twin converts your classes into css objects, ready for passing to your chosen css-in-js library:

```js
import tw from 'twin.macro'

tw`text-sm md:text-lg`

// ↓ ↓ ↓ ↓ ↓ ↓

{
  fontSize: '0.875rem',
  '@media (min-width: 768px)': {
    fontSize: '1.125rem',
  },
}
```

## Features

**🎨 Style with all classes and variants available in [Tailwind v2](https://github.com/tailwindcss/tailwindcss/releases)**

**🐹 Adds no size to your build** - Twin converts classes you’ve used into css objects using Babel and then compiles away, leaving no runtime code

**🛎 Helpful suggestions for mistypings** - Twin chimes in with class and variant values from your Tailwind config:

```bash
✕ ml-7 was not found

Try one of these classes:
ml-0 [0] / ml-1 [0.25rem] / ml-2 [0.5rem] / ml-3 [0.75rem] / ml-4 [1rem] / ml-5 [1.25rem] / ml-6 [1.5rem]
ml-8 [2rem] / ml-10 [2.5rem] / ml-12 [3rem] / ml-16 [4rem] / ml-20 [5rem] / ml-24 [6rem] / ml-32 [8rem]
ml-40 [10rem] / ml-48 [12rem] / ml-56 [14rem] / ml-64 [16rem] / ml-auto [auto] / ml-px [1px]
```

**🖌️ Use the theme import to add values from your tailwind config**

```js
import { theme, css } from 'twin.macro'

const Input = () => <input css={css({ color: theme`colors.purple.500` })} />
```

See more examples [using the theme import →](https://github.com/ben-rogerson/twin.macro/pull/106)

**💥 Add !important to any class with a trailing bang!**

```js
<div tw="hidden!" />
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
<div css={{ "display": "none !important" }} />
```

Add !important to multiple classes with bracket groups:

```js
<div tw="(hidden ml-auto)!" />
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
<div css={{ "display": "none !important", "marginLeft": "auto !important" }} />
```

**🚥 Over 40 variants to prefix on your classes** - Unlike Tailwind, the prefixes are always available to add to your classes

- Prefix with `before:` and `after:` to style pseudo-elements
- Prefix with `hocus:` to style hover + focus at the same time
- Style with extra group states like `group-hocus:` and `group-active:`
- Style form field states with `checked:`, `invalid:` and `required:`
- Stack up variants whenever you need them `sm:hover:first:bg-black`

Check out the [full list of variants →](https://github.com/ben-rogerson/twin.macro/blob/master/src/config/variantConfig.js)

**🍱 Apply variants to multiple classes at once with variant groups**

```js
import 'twin.macro'

const interactionStyles = () => (
  <div tw="hover:(text-black underline) focus:(text-blue-500 underline)" />
)

const mediaStyles = () => <div tw="sm:(w-4 mt-3) lg:(w-8 mt-6)" />

const pseudoElementStyles = () => (
  <div tw="before:(content block w-10 h-10 bg-black)" />
)

const stackedVariants = () => <div tw="sm:hover:(bg-black text-white)" />

const groupsInGroups = () => <div tw="sm:(bg-black hover:(bg-white w-10))">
```

**💡 Integrates with the official tailwind vscode plugin** - Avoid having to look up your classes with auto-completions straight from your tailwind config - [See setup instructions →](https://github.com/ben-rogerson/twin.macro/discussions/227)

## Get started

Take a look at these examples to get started:

#### React

[💅 styled-components](https://github.com/ben-rogerson/twin.examples/tree/master/react-styled-components) &nbsp; [👩‍🎤 emotion](https://github.com/ben-rogerson/twin.examples/tree/master/react-emotion)

#### Preact

[💅 styled-components](https://github.com/ben-rogerson/twin.examples/tree/master/preact-styled-components) &nbsp; [🥜 goober](https://github.com/ben-rogerson/twin.examples/tree/master/preact-goober)

#### Create React App

[💅 styled-components](https://github.com/ben-rogerson/twin.examples/tree/master/cra-styled-components) &nbsp; [👩‍🎤 emotion](https://github.com/ben-rogerson/twin.examples/tree/master/cra-emotion)

#### Gatsby

[💅 styled-components](https://github.com/ben-rogerson/twin.examples/tree/master/gatsby-styled-components) &nbsp; [👩‍🎤 emotion](https://github.com/ben-rogerson/twin.examples/tree/master/gatsby-emotion)

#### Next.js

[💅 styled-components](https://github.com/ben-rogerson/twin.examples/tree/master/next-styled-components) &nbsp; [👩‍🎤 emotion](https://github.com/ben-rogerson/twin.examples/tree/master/next-emotion)

#### Snowpack

[💅 styled-components](https://github.com/ben-rogerson/twin.examples/tree/master/snowpack-react-styled-components) &nbsp; [💅 styled-components (TypeScript)](https://github.com/ben-rogerson/twin.examples/tree/master/snowpack-react-emotion-typescript) &nbsp; [👩‍🎤 emotion](https://github.com/ben-rogerson/twin.examples/tree/master/snowpack-react-emotion)

#### Storybook

[👩‍🎤 emotion](https://github.com/ben-rogerson/twin.examples/tree/master/storybook-emotion)

#### Monorepo component library

[💅 styled-components (TypeScript)](https://github.com/ben-rogerson/twin.examples/tree/master/component-library-styled-components)

#### Laravel

[💅 styled-components (TypeScript)](https://github.com/ben-rogerson/twin.examples/tree/master/laravel-styled-components-typescript)

## Plugins

You can use many Tailwind plugins with twin, like [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography) and [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) but there’s no compatibility with plugins that use the `addVariant` function.

[See list of supported plugins →](https://twin-docs.netlify.app/plugin-support)

## TypeScript

Twin fully supports TypeScript projects and includes types for every import _except_ the `css` and `styled` imports.

[How to add the missing `css` and `styled` types →](docs/typescript.md)

## Community

[Drop into our Discord server](https://discord.gg/Xj6x9z7) for announcements, help and styling chat.

<a href="https://discord.gg/Xj6x9z7"><img src="https://img.shields.io/discord/705884695400939552?label=discord&logo=discord" alt="Discord"></a>

## Resources

- [Create advanced themes with css variables](docs/advanced-theming.md)
- [Sync your screen breakpoints with javascript](https://gist.github.com/ben-rogerson/b4b406dffcc18ae02f8a6c8c97bb58a8)
- [Twin vscode snippits for easier imports](https://gist.github.com/ben-rogerson/c6b62508e63b3e3146350f685df2ddc9)
- [Use the official vscode intellisense extension with twin](https://github.com/ben-rogerson/twin.macro/discussions/227)
- [Tailwind class cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- ["Why I Love Tailwind" by Max Stoiber](https://mxstbr.com/thoughts/tailwind)

## Special thanks

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a big shout out goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with tailwind.macro has been such a pleasure.
