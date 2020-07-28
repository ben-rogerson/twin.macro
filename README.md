<p align="center">
  <img src="https://i.imgur.com/dIwewYI.png" alt="twin logo" width="360"><br>
    <br>Use Tailwind classes within css-in-js libraries<br><br>
    <a href="https://www.npmjs.com/package/twin.macro"><img src="https://img.shields.io/npm/dt/twin.macro.svg" alt="Total Downloads"></a>
    <a href="https://www.npmjs.com/package/twin.macro"><img src="https://img.shields.io/npm/v/twin.macro.svg" alt="Latest Release"></a>
    <a href="https://discord.gg/Xj6x9z7"><img src="https://img.shields.io/discord/705884695400939552?label=discord&logo=discord" alt="Discord"></a>
</p>

---

Use Twin’s `tw` prop to add Tailwind classes onto jsx elements:

```js
import 'twin.macro'

export default () => <input tw="border hover:border-black" />
```

Nest Twin’s `tw` import within a css prop to add conditional styles:

```js
import tw from 'twin.macro'

export default ({ hasHover }) => (
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
export default ({ hasHover }) => (
  <input css={[tw`border`, hasHover && hoverStyles]} />
)
```

### Styled Components

You can also use the tw import to create and style new components:

```js
import tw from 'twin.macro'

const Input = tw.input`border hover:border-black`
export default () => <Input />
```

And clone and style existing components:

```js
const PurpleInput = tw(Input)`border-purple-500`
```

Switch to the styled import to add conditional styling:

```js
import tw, { styled } from 'twin.macro'

const Input = styled.input(({ hasHover }) => [
  `color: purple;`,
  tw`border rounded`,
  hasHover && tw`hover:border-black`,
])
export default () => <Input hasHover />
```

Or use backticks to mix with sass styles:

```js
import tw, { styled } from 'twin.macro'

const Input = styled.input`
  color: purple;
  ${tw`border rounded`}
  ${({ hasHover }) => hasHover && tw`hover:border-black`}
`
export default () => <Input hasHover />
```

## How it works

When babel runs over your code, Twin’s `css` and `styled` imports are swapped with the real imports from libraries like [👩‍🎤&nbsp;emotion](https://emotion.sh/docs/introduction) and [💅&nbsp;styled&#8209;components](https://styled-components.com/).

Twin offers import presets for both libraries or you can fully customise the imports.

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

**🎨 Style with all classes and variants from [Tailwind v1.6.x+](https://github.com/tailwindcss/tailwindcss/releases)**

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

**💥 Add important to any class with a trailing bang!**

```js
tw`hidden!`
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
{ "display": "none !important" }
```

**🚥 Over 40 variants to prefix on your classes** - Unlike Tailwind, the prefixes are always available to add to your classes

- Prefix with `before:` and `after:` to style pseudo-elements
- Prefix with `hocus:` to style hover + focus at the same time
- Style with extra group states like `group-hocus:` and `group-active:`
- Style form field states with `checked:`, `invalid:` and `required:`
- Stack variants for nested styles `sm:hover:`

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
```

## Getting started

| "Vanilla" React   |                                                                                                            |                                         |
| :---------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Emotion           | [Demo](https://codesandbox.io/embed/react-tailwind-emotion-starter-3d1dl?module=%2Fsrc%2FApp.js)           | [Docs](docs/emotion/react.md)           |
| Styled Components | [Demo](https://codesandbox.io/embed/react-tailwind-styled-components-starter-f87y7?module=%2Fsrc%2FApp.js) | [Docs](docs/styled-components/react.md) |

| Create React App  |                                                                                                               |                                                    |
| :---------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Emotion           | [Demo](https://codesandbox.io/embed/cra-tailwind-emotion-starter-bi1kx?module=%2Fsrc%2FApp.js)                | [Docs](docs/emotion/create-react-app.md)           |
| Styled Components | [Demo](https://codesandbox.io/embed/cra-styled-components-tailwind-twin-starter-m8cyz?module=%2Fsrc%2FApp.js) | [Docs](docs/styled-components/create-react-app.md) |

| Gatsby            |                                                                                                                       |                                          |
| :---------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Emotion           | [Demo](https://codesandbox.io/embed/gatsby-tailwind-emotion-starter-z3hun?module=%2Fsrc%2Fpages%2Findex.js)           | [Docs](docs/emotion/gatsby.md)           |
| Styled Components | [Demo](https://codesandbox.io/embed/gatsby-tailwind-styled-components-starter-trrlp?module=%2Fsrc%2Fpages%2Findex.js) | [Docs](docs/styled-components/gatsby.md) |

| Next.js           |                                                                                                               |                                        |
| :---------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Emotion           | [Demo](https://codesandbox.io/embed/next-tailwind-emotion-starter-8h2b2?module=%2Fpages%2Findex.js)           | [Docs](docs/emotion/next.md)           |
| Styled Components | [Demo](https://codesandbox.io/embed/next-tailwind-styled-components-starter-m1f6d?module=%2Fpages%2Findex.js) | [Docs](docs/styled-components/next.md) |

| Vue     |                                                                                                                     |
| :------ | ------------------------------------------------------------------------------------------------------------------- |
| Emotion | [Demo](https://codesandbox.io/embed/vue-emotion-tailwind-twin-starter-2yd61?module=%2Fsrc%2FApp.vue) (Experimental) |

## Plugins

You can use many Tailwind plugins with twin, like [Tailwind UI](https://tailwindui.com/components) and [Custom forms](https://github.com/tailwindcss/custom-forms) but there’s no compatibility with other plugins that use the `addVariant` or `addBase` functions.

Check out the [list of supported plugins →](https://twin-docs.netlify.app/plugin-support)

## TypeScript

Twin comes with types for the `tw` import.
You’ll just need to [complete the TypeScript setup](docs/typescript.md) for `styled` and `css`.

## Community

[Drop into our Discord server](https://discord.gg/Xj6x9z7) for announcements, help and styling chat.

<a href="https://discord.gg/Xj6x9z7"><img src="https://img.shields.io/discord/705884695400939552?label=discord&logo=discord" alt="Discord"></a>

## Resources

- Lookup that elusive class on [Nerdcave’s Tailwind cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- Add more TypeScript features with [typescript-plugin-tw-template](https://github.com/kingdaro/typescript-plugin-tw-template)
- [Why I Write CSS in JavaScript](https://mxstbr.com/thoughts/css-in-js) by Max Stoiber

## Special thanks

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a big shout out goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with tailwind.macro has been such a pleasure.
