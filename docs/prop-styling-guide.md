# The prop styling guide

## Basic styling

Use Twin’s tw prop to add Tailwind classes onto jsx elements:

```js
import 'twin.macro'

const Component = () => (
  <div tw="flex w-full">
    <div tw="w-1/2"></div>
    <div tw="w-1/2"></div>
  </div>
)
```

- Use the tw prop when conditional styles aren’t needed
- Any import from `twin.macro` activates the tw prop
- Remove the need for an import with [babel-plugin-twin](https://github.com/ben-rogerson/babel-plugin-twin)

## Conditional styling

To add conditional styles, nest the styles in an array and use the `css` prop:

```js
import tw from 'twin.macro'

const Component = ({ hasBg }) => (
  <div
    css={[
      tw`flex w-full`, // Add base styles first
      hasBg && tw`bg-black`, // Then add conditional styles
    ]}
  >
    <div tw="w-1/2" />
    <div tw="w-1/2" />
  </div>
)
```

<details>

<summary>TypeScript example</summary>

```tsx
import tw from 'twin.macro'

interface ComponentProps {
  hasBg?: string
}

const Component = ({ hasBg }: ComponentProps) => (
  <div
    css={[
      tw`flex w-full`, // Add base styles first
      hasBg && tw`bg-black`, // Then add conditional styles
    ]}
  >
    <div tw="w-1/2" />
    <div tw="w-1/2" />
  </div>
)
```

</details>

- Twin adds the css prop from your css-in-js library
- Adding values to an array makes it easier to define base styles, conditionals and vanilla css
- Use multiple lines to organize styles within the backticks ([template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals))

## Overriding styles

Use the `tw` prop after the css prop to add any overriding styles:

```js
import tw from 'twin.macro'

const Component = () => (
  <div css={tw`text-white`} tw="text-black">
    Has black text
  </div>
)
```

## Keeping jsx clean

It’s no secret that when tailwind class sets become larger, they obstruct the readability of other jsx props.

To clean up the jsx, lift the styles out and group them as named entries in an object:

```js
import tw from 'twin.macro'

const styles = {
  container: ({ hasBg }) => [
    tw`flex w-full`, // Add base styles first
    hasBg && tw`bg-black`, // Then add conditional styles
  ],
  column: tw`w-1/2`,
}

const Component = ({ hasBg }) => (
  <section css={styles.container({ hasBg })}>
    <div css={styles.column} />
    <div css={styles.column} />
  </section>
)
```

<details>
  <summary>TypeScript example</summary>

```js
import tw from 'twin.macro'

interface ContainerProps {
  hasBg?: boolean;
}

const styles = {
  container: ({ hasBg }: ContainerProps) => [
    tw`flex w-full`, // Add base styles first
    hasBg && tw`bg-black`, // Then add conditional styles
  ],
  column: tw`w-1/2`,
}

const Component = ({ hasBg }: ContainerProps) => (
  <section css={styles.container({ hasBg })}>
    <div css={styles.column} />
    <div css={styles.column} />
  </section>
)
```

</details>

## Variants with many values

When a variant has many values (eg: `variant="light/dark/etc"`), name the class set in an object and use a prop to grab the entry containing the styles:

```js
import tw from 'twin.macro'

const containerVariants = {
  // Named class sets
  light: tw`bg-white text-black`,
  dark: tw`bg-black text-white`,
  crazy: tw`bg-yellow-500 text-red-500`,
}

const styles = {
  container: ({ variant = 'dark' }) => [
    tw`flex w-full`,
    containerVariants[variant], // Grab the variant style via a prop
  ],
  column: tw`w-1/2`,
}

const Component = ({ variant }) => (
  <section css={styles.container({ variant })}>
    <div css={styles.column} />
    <div css={styles.column} />
  </section>
)
```

<details>
  <summary>TypeScript example</summary>

Use the `TwStyle` import to type tw blocks:

```tsx
import tw, { TwStyle } from 'twin.macro'

type WrapperVariant = 'light' | 'dark' | 'crazy'

interface ContainerProps {
  variant?: WrapperVariant
}

const containerVariants: Record<WrapperVariant, TwStyle> = {
  // Named class sets
  light: tw`bg-white text-black`,
  dark: tw`bg-black text-white`,
  crazy: tw`bg-yellow-500 text-red-500`,
}

const styles = {
  container: ({ variant = 'dark' }: ContainerProps) => [
    tw`flex w-full`,
    containerVariants[variant], // Grab the variant style via a prop
  ],
  column: tw`w-1/2`,
}

const Component = ({ variant }: ContainerProps) => (
  <section css={styles.container({ variant })}>
    <div css={styles.column} />
    <div css={styles.column} />
  </section>
)
```

</details>

## Interpolation workaround

Due to Babel limitations, tailwind classes and short css values can’t have any part of them dynamically created.

So interpolated values like this won’t work:

```js
<div tw="mt-${spacing === 'sm' ? 2 : 4}" /> // Won't work with tailwind classes
<div tw="margin-top[${spacing === 'sm' ? 2 : 4}rem]" /> // Won't work with short css
```

This is because babel doesn’t know the values of the variables and so twin can’t make a conversion to css.

Instead, define the classes in objects and grab them using props:

```js
import tw from 'twin.macro'

const styles = { sm: tw`mt-2`, lg: tw`mt-4` }

const Component = ({ spacing = 'sm' }) => <div css={styles[spacing]} />
```

Or combine vanilla css with twins `theme` import:

```js
import { theme } from 'twin.macro'

// Use theme values from your tailwind config
const styles = { sm: theme`spacing.2`, lg: theme`spacing.4` }

const Component = ({ spacing = 'sm' }) => (
  <div css={{ marginTop: styles[spacing] }} />
)
```

Or we can always fall back to vanilla css, which can interpolate anything:

```js
import { theme } from 'twin.macro'

const Component = ({ width = 5 }) => <div css={{ maxWidth: `${width}rem` }} />
```

## Custom css

Basic css is added using the “short css” syntax or within the vanilla css which supports more advanced use cases like dynamic/interpolated values.

### Simple css styling

To add simple custom styling, use twins “short css” syntax:

```js
// Set content properties for pseudo elements
<div tw="before:(content['hey there'] block)" />

// Set css variables
<div tw="--my-width-variable[calc(100vw - 10rem)]" />

// Use css variables
<div tw="width[--my-width-variable]" />

// Set vendor prefixes
<div tw="-webkit-line-clamp[3]" />

// Set grid areas
<div tw="grid-area[1 / 1 / 4 / 2]" />
```

Use short css with twin’s variants and grouping features:

```js
<div tw="block md:(relative max-width[calc(100vw - 2em)])" />
```

Short css also works with the `tw` import:

```js
import tw from 'twin.macro'
;<div
  css={tw`
    block
    md:(relative max-width[calc(100vw - 2em)])
  `}
/>
```

- Add a trailing bang to make the custom css !important: `max-width[2rem]!`
- To keep short css separate from tw classes, add it in the `cs` prop: `<div cs="max-width[2rem]" />`
- Short css can have camelCase properties: `maxWidth[2rem]`

### Advanced css styling

The css prop accepts a sass-like syntax, allowing both custom css and tailwind styles with values that can come from your tailwind config:

```js
import tw, { css, theme } from 'twin.macro'

const Components = () => (
  <input
    css={[
      tw`text-blue-500 border-2`,
      css`
        -webkit-tap-highlight-color: transparent; /* add css styles */
        background-color: ${theme`colors.red.500`}; /* use the theme import to add config values */
        &::selection {
          ${tw`text-purple-500`}; /* style with tailwind classes */
        }
      `,
    ]}
  />
)
```

But it’s often cleaner to use an object to add styles as it avoids the interpolation cruft seen above:

```js
import tw, { css, theme } from 'twin.macro'

const Components = () => (
  <input
    css={[
      tw`text-blue-500 border-2`,
      css({
        WebkitTapHighlightColor: 'transparent', // css properties are camelCased
        backgroundColor: theme`colors.red.500`, // values don’t require interpolation
        '&::selection': tw`text-purple-500`, // single line tailwind selector styling
      }),
    ]}
  />
)
```

## Learn more

- [Styled component guide](https://github.com/ben-rogerson/twin.macro/blob/master/docs/styled-component-guide.md) - A must-read guide on getting productive with styled-components

## Resources

- [babel-plugin-twin](https://github.com/ben-rogerson/babel-plugin-twin) - Use the tw and css props without adding an import
- [React + Tailwind breakpoint syncing](https://gist.github.com/ben-rogerson/b4b406dffcc18ae02f8a6c8c97bb58a8) - Sync your tailwind.config.js breakpoints with react
- [Twin VSCode snippits](https://gist.github.com/ben-rogerson/c6b62508e63b3e3146350f685df2ddc9) - For devs who want to type less
- [Twin VSCode extensions](https://github.com/ben-rogerson/twin.macro/discussions/227) - For faster class suggestions and feedback
