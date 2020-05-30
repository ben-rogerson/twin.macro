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
import tw, { styled } from 'twin.macro'

const Input = styled.input`
  ${({ hasHover }) => hasHover && tw`hover:border-black`}
  ${tw`border`}
  color: purple;
`
export default () => <Input hasHover />
```

Add conditional styles on jsx elements with the css import and the css prop:

```js
import tw, { css } from 'twin.macro'

const Input = ({ hasHover }) => (
  <input
    css={[
      hasHover && tw`hover:border-black`,
      tw`border`,
      css`
        color: white;
      `,
    ]}
  />
)
export default () => <Input hasHover />
```

## How it works

When babel runs over your code, Twin's `css` and `styled` imports are swapped with the real imports from libraries like [👩‍🎤 emotion](https://emotion.sh/docs/introduction) and [💅 styled-components](https://styled-components.com/).

When you use `tw`, Twin converts your classes into css objects which are accepted by most css-in-js libraries:

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

## Installation

Take a look at our quick-start guides for:

### Emotion (default)

- ["Vanilla" React + Emotion](docs/emotion/react.md)
- [Create React App + Emotion](docs/emotion/create-react-app.md)
- [Gatsby + Emotion](docs/emotion/gatsby.md)
- [Next.js + Emotion](docs/emotion/next.md)

### Styled Components

- ["Vanilla" React + Styled Components](docs/styled-components/react.md)
- [Create React App + Styled Components](docs/styled-components/create-react-app.md)
- [Gatsby + Styled Components](docs/styled-components/gatsby.md)
- [Next.js + Styled Components](docs/styled-components/next.md)

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

## Community

Join us in the [Twin Discord](https://discord.gg/n8ZhNSb) for announcements, help and styling chat.

## Resources

- Lookup that elusive class on [Nerdcave’s Tailwind cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
- Further docs at the [official Tailwind documentation](https://tailwindcss.com/docs/installation)
- Add more TypeScript features with [typescript-plugin-tw-template](https://github.com/kingdaro/typescript-plugin-tw-template)

## Special thanks

This project stemmed from [babel-plugin-tailwind-components](https://github.com/bradlc/babel-plugin-tailwind-components) so a big shout out goes to [Brad Cornes](https://github.com/bradlc) for the amazing work he produced. Styling with tailwind.macro has been such a pleasure.
