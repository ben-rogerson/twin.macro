# The css prop guide

So we already know we can use Twin’s tw prop to add basic styling onto jsx elements using the tw prop:

```js
import 'twin.macro'

export default () => <input tw="text-black" />

// We can also use curly brackets
export default () => <input tw={"text-black"}>
```

But before too long, we’re going to need conditional styling in our components.

And that’s where the css prop comes in.

The css prop allows us to add styles in different ways:

1. **[Directly within the css prop]()** `css={...}`<br/>When we have a single conditional or if we have moved styling out to a variable or function
2. **[Within an array]()** `css={[...]}`<br/>The best choice for when we have both common and conditional styling
3. **[Within an object]()** `css={{...}}`<br/>Minimise style duplication on elements by using spreading operators to combine class sets
4. **[Within backticks]()** `` css={`...`} ``<br/>Good for mixing lots of sass or css with tailwind classes

> The prop isn't available in your jsx by default, it's added in different ways depending on the styling library and js framework. Check the [installation guides](./../README.md#installation) for setup instructions.

## 1. Styling on the css prop

We can add basic styling directly within curly brackets:

```js
import tw from 'twin.macro'

export default ({ isDark }) => (
  <input css={isDark ? tw`bg-black text-white` : tw`bg-white text-black`} />
)
```

But when the style sets become too long, we can move them out of our jsx and into a variable:

```js
import tw from 'twin.macro'

export default ({ isDark }) => {
  const styles = isDark
    ? tw`bg-black text-white border border-white placeholder-gray-500 tracking-tight rounded`
    : tw`bg-white text-black border border-black placeholder-gray-700 tracking-wide rounded`
  return <input css={styles} />
}
```

Or we can move them outside our component into separate variables:

```js
import tw from 'twin.macro'

const darkStyles = tw`bg-black text-white border border-white placeholder-gray-500 tracking-tight rounded`
const lightStyles = tw`bg-white text-black border border-black placeholder-gray-700 tracking-wide rounded`

export default ({ isDark }) => <input css={isDark ? darkStyles : lightStyles} />
```

Alternatively we can group them into a single style object:

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

The style objects could also be broken down and grouped into smaller sets:

```js
import tw from 'twin.macro'

const inputBase = {
  dark: tw`bg-black placeholder-gray-700 border border-white rounded`,
  light: tw`bg-white placeholder-gray-500 border border-black rounded`,
}

const inputText = {
  dark: tw`text-black tracking-wide`,
  light: tw`text-white tracking-tight`,
}

const styles = {
  dark: [inputBase.dark, inputText.light],
  light: [inputBase.light, inputText.dark],
}

export default ({ isDark }) => (
  <input css={isDark ? styles.dark : styles.light} />
)
```

At this point we can think about moving `inputBase` and `inputText` into another file to be reused across different components.

## 2. Styling within an array

**When we have both common and conditional styling, it can be cleaner to add our styles to an array.**

Let’s start by grouping the common input styles together as a separate array item:

```js
import tw from 'twin.macro'

export default ({ isDark }) => {
  const styles = [
    tw`rounded border`,
    isDark &&
      tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
    !isDark &&
      tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
  ]
  return <input css={styles} />
}
```

To completely decouple our styles from our component, we can add the styles to a function:

```js
import tw from 'twin.macro'

const styles = ({ isDark }) => [
  tw`rounded border`,
  isDark &&
    tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
  !isDark &&
    tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
]

export default props => <input css={styles(props)} />
```

This can be a good option if we have a number of other attributes sitting alongside the css prop because large style sets make it harder to scan though our jsx.

## 3. Styling within an object

**Using an object is great for combining style sets with the spread operator.**

If you can't stand seeing some duplicated styles on your elements in your dev tools, then this could be your favourite option:

```js
import tw from 'twin.macro'

const inputStyles = {
  base: tw`rounded border`,
  dark: tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
  light: tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
}

export default ({ isDark }) => {
  const styles = {
    ...inputStyles.base,
    ...(isDark ? inputStyles.dark : inputStyles.light),
  }
  return <input css={styles} />
}
```

And we can move the styles and logic outside the component with a function:

```js
import tw from 'twin.macro'

const inputStyles = {
  base: tw`rounded border`,
  dark: tw`bg-black text-white border-white placeholder-gray-500 tracking-tight`,
  light: tw`bg-white text-black border-black placeholder-gray-700 tracking-wide`,
}

const styles = ({ isDark }) => {
  ...inputStyles.base,
  // We can also write our conditions without ternary
  ...(isDark && inputStyles.dark),
  ...(!isDark && inputStyles.light),
}

export default props => <input css={styles(props)} />
```

## 4. Styling within backticks

**Sometimes we need to drop into css to get things done and that’s when we can use backticks.**

- The css prop supports sass-like functions like `&` and nesting
- Everything we can do with array styling, we can do within backticks
- Extra interpolation brackets (`${}`) are required whenever we use tailwind classes within them

```js
import tw, { css } from 'twin.macro'

export default ({ isFancy }) => (
  <input
    css={
      // The css import here gives us syntax highlighting
      css`
        caret-color: purple;

        /* Mix and match sass/css with tw classes */
        &::selection {
          ${isFancy && tw`bg-purple-500`}
        }

        /* tw classes are still welcome here */
        ${tw`rounded px-6`}
      `
    }
  />
)
```

The backtick block can be moved into a variable:

```js
import tw, { css } from 'twin.macro'

export default ({ isFancy }) => {
  // As soon as we move the backticks to a variable the css import is required
  const styles = css`
    caret-color: purple;

    /* Mix and match sass/css with tw classes */
    &::selection {
      ${isFancy && tw`bg-purple-500`}
    }

    /* tw classes are still welcome here */
    ${tw`rounded px-6`}
  `
  return <input css={styles} />
}
```

And just like the other examples, it can be decoupled from our component as a function:

```js
import tw, { css } from 'twin.macro'

const styles = ({ isFancy }) => css`
  caret-color: purple;

  /* Mix and match sass/css with tw classes */
  &::selection {
    ${isFancy && tw`bg-purple-500`}
  }

  /* tw classes are still welcome here */
  ${tw`rounded px-6`}
`

export default props => <input css={styles(props)} />
```

### That's it!

As you can see, jsx gives us ways to compose styles that we simply can't do in normal html. Using the power of css-in-js, we can couple our styles with our components and create common style sets whenever we need.

If you have any further questions, feel free to [Drop into our Discord server](https://discord.gg/n8ZhNSb).

<a href="https://discord.gg/n8ZhNSb"><img src="https://img.shields.io/discord/705884695400939552?label=discord&logo=discord" alt="Discord"></a>

## Read more about the css prop

- [The css prop in emotion](https://emotion.sh/docs/css-prop)
- [The css prop in styled-components](https://styled-components.com/docs/api#css-prop)

#### The Styled components guide is coming coon.
