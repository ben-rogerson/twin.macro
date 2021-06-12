# Screen import

The screen import creates media queries for custom css that sync with your tailwind config screen values (sm, md, lg, etc).

**Usage with the css prop**

```js
import tw, { screen, css } from 'twin.macro'

const styles = [
  // Add styles with object syntax
  screen`sm`({ display: 'block', ...tw`inline` }),
  // Or add styles with template literals
  screen`md``display: block; ${css(tw`inline`)}`,
]

<div css={styles} />
```

**Usage with styled components**

```js
import tw, { styled, screen, css } from 'twin.macro'

const Component = styled.div(() => [
  // Add styles with object syntax
  screen`sm`({ display: 'block', ...tw`inline` }),
  // Or add styles with template literals
  screen`md``display: block; ${css(tw`inline`)}`,
])

<Component />
```

## Screen as a key

Without the styles, the screen import just creates a media query, so you can use it as a key:

```js
<div
  css={{
    [screen`2xl`]: { display: 'block' },
  }}
/>

// ↓ ↓ ↓ ↓ ↓ ↓

<div
  css={{
    '@media (min-width: 1536px)': { display: 'block' },
  }}
/>
```

## Relaxed usage

The screen import can be used in different ways:

```js
screen`sm`({ ... })
screen('sm')({ ... })
screen(`sm`)({ ... })
screen.sm({ ... }) // Dot syntax can’t be used when the screen begins with a number, eg: screen.2xl
```

## Custom media queries

Since the screen import always adds a min-width query, it’s not suitable for constructing custom media queries.

So to add custom media queries, use the theme import instead.

**With the css prop**

```js
import tw, { theme } from 'twin.macro'

const styles = {
  // Object styles
  [`@media (max-width: ${theme`screens.sm`})`]: {
    display: 'block',
    ...tw`inline`,
  },
  // Template literal styles
  [`@media (max-width: ${theme`screens.md`})`]: `
    display: block;
  `,
}

<div css={styles} />
```

**With a styled component**

```js
import tw, { styled, theme } from 'twin.macro'

const Component = styled.div({
  // Object styles
  [`@media (max-width: ${theme`screens.sm`})`]: {
    display: 'block',
    ...tw`inline`,
  },
  // Template literal styles
  [`@media (max-width: ${theme`screens.md`})`]: `
    display: block;
  `,
})

<Component />
```

---

[&lsaquo; Documentation](https://github.com/ben-rogerson/twin.macro/blob/master/docs/index.md)
