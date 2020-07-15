<p align="center">
  <img src="header.png" width="800" alt="The css prop guide">
</p>

**The quickest way to style is not with the css prop, it’s with the tw prop.**

The tw prop is similar to a html attribute as it only accepts a string of tailwind classes.

```js
// The tw prop
// ✓ Great for basic styling
// ✕ No conditional styles
// ✕ Limited style organization options

import 'twin.macro'

export default () => <input tw="text-black hover:text-purple-500" />
```

This is fine for basic styling but we often need to add styles based on props or state.

To open up new styling options we need to move our styles to the tw import and swap the `tw` prop with the `css` prop.

```js
// The css prop
// ✓ Great for medium - advanced styling
// ✓ Conditional styles
// ✓ Many style organization options

import tw from 'twin.macro'

export default ({ isDark }) => {
  const styles = isDark
    ? tw`bg-black text-white border border-white placeholder-gray-500 tracking-tight rounded`
    : tw`bg-white text-black border border-black placeholder-gray-700 tracking-wide rounded`
  return <input css={styles} />
}
```

We can now move the styles outside the component into separate variables:

```js
import tw from 'twin.macro'

const darkStyles = tw`bg-black text-white border border-white placeholder-gray-500 tracking-tight rounded`
const lightStyles = tw`bg-white text-black border border-black placeholder-gray-700 tracking-wide rounded`

export default ({ isDark }) => <input css={isDark ? darkStyles : lightStyles} />
```

Or we could group them in an object:

```js
import tw from 'twin.macro'

const styles = {
  dark: tw`bg-black text-white border border-white placeholder-gray-500 tracking-tight rounded`,
  light: tw`bg-white text-black border border-black placeholder-gray-700 tracking-wide rounded`,
}

export default ({ isDark }) => (
  <input css={isDark ? styles.dark : styles.light} />
)
```

### Optimizing for style reuse

The style objects can be grouped into smaller sets that have a common styling focus. This example separates the styles into groups targeting the text and the base input:

```js
import tw from 'twin.macro'

const inputText = {
  dark: tw`text-black tracking-wide`,
  light: tw`text-white tracking-tight`,
}

const inputBase = {
  dark: tw`bg-black placeholder-gray-700 border border-white rounded`,
  light: tw`bg-white placeholder-gray-500 border border-black rounded`,
}

const styles = {
  dark: [inputBase.dark, inputText.light],
  light: [inputBase.light, inputText.dark],
}

export default ({ isDark }) => (
  <input css={isDark ? styles.dark : styles.light} />
)
```

At this point we may choose to move `inputBase` and `inputText` into another file to be reused across different components.

## A place for common "base" styles

In the examples above, the styles which are always applied to our component need to be repeated within each style block.

This style duplication bloats our code and means we need to keep the component base styles "in sync" across the different states.

You may be used to styling this way in regular tailwind, but let’s explore some alternatives that css-in-js can provide.

## Styling within an array

Adding the styles to an array is the cleanest choice when we have both common and conditional styling.

**✓** Gives us places to put common styles<br/>
**✓** Conditional styling requires the least amount of code

Styles inside the component:

```js
import tw from 'twin.macro'

export default ({ isDark }) => {
  const styles = [
    // Common base styles
    tw`rounded border`,
    // Conditional styles
    isDark &&
      tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
    !isDark &&
      tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
  ]
  return <input css={styles} />
}
```

Styles outside the component:

```js
import tw from 'twin.macro'

const styles = ({ isDark }) => [
  // Common base styles
  tw`rounded border`,
  // Conditional styles
  isDark &&
    tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
  !isDark &&
    tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
]

export default props => <input css={styles(props)} />
```

## Styling within an object

This option minimizes the style duplication output on elements by using the spread operator to merge classes.

**✓** Helps avoids some overridden element styles shown in the browser dev tools<br/>
**✓** Gives us places to put common styles<br/>
**✕** Our code gets "dotty" and can affect readability

Styles inside the component:

```js
import tw from 'twin.macro'

const inputStyles = {
  common: tw`rounded border`,
  dark: tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
  light: tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
}

export default ({ isDark }) => {
  const styles = {
    ...inputStyles.common,
    ...(isDark ? inputStyles.dark : inputStyles.light),
  }
  return <input css={styles} />
}
```

Styles outside the component:

```js
import tw from 'twin.macro'

const inputStyles = {
  common: tw`rounded border`,
  dark: tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
  light: tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
}

const styles = ({ isDark }) => ({
  ...inputStyles.common,
  ...(isDark ? inputStyles.dark : inputStyles.light),
})

export default props => <input css={styles(props)} />
```

## Styling within a template string

When you need to write more css or sass than tailwind classes then this option makes the most sense.

**✓** Effortlessly write styles with sass or css<br/>
**✓** Gives us places to put common styles<br/>
**✓** Familiar for css-in-js users coming from styled-components<br/>
**✕** Extra interpolation brackets (`${}`) are required whenever you add tailwind classes

Styles inside the component:

```js
import tw, { css } from 'twin.macro'

export default ({ isFancy }) => {
  const styles = css`
    caret-color: purple;
    ${tw`rounded px-6`}

    &::selection {
      ${isFancy && tw`bg-purple-500`}
    }
  `
  return <input css={styles} />
}
```

Styles outside the component:

```js
import tw, { css } from 'twin.macro'

const styles = ({ isFancy }) => css`
  caret-color: purple;
  ${tw`rounded px-6`}

  &::selection {
    ${isFancy && tw`bg-purple-500`}
  }
`

export default props => <input css={styles(props)} />
```

### Summary

The style prop gives us ways to compose styles that we simply can’t do in normal html. With a little amount of code, we can couple styles in or out of our components and create common style sets whenever we need.

If you have any further questions, feel free to [drop into our Discord server](https://discord.gg/Xj6x9z7).

<a href="https://discord.gg/Xj6x9z7"><img src="https://img.shields.io/discord/705884695400939552?label=discord&logo=discord" alt="Discord"></a>

## More about the css prop

- [The css prop in emotion](https://emotion.sh/docs/css-prop)
- [The css prop in styled-components](https://styled-components.com/docs/api#css-prop)

> The css prop isn’t available in your jsx by default, it’s added in different ways depending on your styling library and framework. Check the [installation guides](./../README.md#installation) for setup instructions.
