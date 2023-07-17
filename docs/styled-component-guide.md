# Styled component guide

## Basic styling

Use Twin’s `tw` import to create and style new components with Tailwind classes:

```js
import tw from 'twin.macro'

const Wrapper = tw.section`flex w-full`
const Column = tw.div`w-1/2`

const Component = () => (
  <Wrapper>
    <Column></Column>
    <Column></Column>
  </Wrapper>
)
```

## Conditional styling

To add conditional styles, nest the styles in an array and use the `styled` import:

```js
import tw, { styled } from 'twin.macro'

const Container = styled.div(({ hasBg }) => [
  tw`flex w-full`, // Add base styles first
  hasBg && tw`bg-black`, // Then add conditional styles
])
const Column = tw.div`w-1/2`

const Component = ({ hasBg }) => (
  <Container {...{ hasBg }}>
    <Column></Column>
    <Column></Column>
  </Container>
)
```

<details>
  <summary>TypeScript example</summary>

```tsx
import tw, { styled } from 'twin.macro'

interface ContainerProps {
  hasBg?: string
}

const Container = styled.div<ContainerProps>(({ hasBg }) => [
  tw`flex w-full`, // Add base styles first
  hasBg && tw`bg-black`, // Then add conditional styles
])
const Column = tw.div`w-1/2`

const Component = ({ hasBg }: ContainerProps) => (
  <Container {...{ hasBg }}>
    <Column></Column>
    <Column></Column>
  </Container>
)
```

</details>

- Adding styles in an array makes it easier to separate base styles, conditionals and vanilla css
- The `styled` import comes from the css-in-js library, twin just exports it
- Use multiple lines to organize styles within the backticks ([template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals))

## Variants with many values

When a variant has many values (eg: `variant="light/dark/etc"`), name the class set in an object and use a prop to grab the entry containing the styles. Note that you must return a function as follows:

```js
import tw, { styled } from 'twin.macro'

const containerVariants = {
  // Named class sets
  light: tw`bg-white text-black`,
  dark: tw`bg-black text-white`,
  crazy: tw`bg-yellow-500 text-red-500`,
}

const Container = styled.section(() => [
  // Return a function here
  tw`flex w-full`,
  ({ variant = 'dark' }) => containerVariants[variant], // Grab the variant style via a prop
])
const Column = tw.div`w-1/2`

const Component = () => (
  <Container variant="light">
    <Column></Column>
    <Column></Column>
  </Container>
)
```

<details>
  <summary>TypeScript example</summary>

Use the `TwStyle` import to type tw blocks:

```tsx
import tw, { styled, TwStyle } from 'twin.macro'

type ContainerVariant = 'light' | 'dark' | 'crazy'

interface ContainerProps {
  variant?: ContainerVariant
}

// Use the `TwStyle` import to type tw blocks
const containerVariants: Record<ContainerVariant, TwStyle> = {
  // Named class sets
  light: tw`bg-white text-black`,
  dark: tw`bg-black text-white`,
  crazy: tw`bg-yellow-500 text-red-500`,
}

const Container = styled.section<ContainerProps>(() => [
  // Return a function here
  tw`flex w-full`,
  ({ variant = 'dark' }) => containerVariants[variant], // Grab the variant style via a prop
])
const Column = tw.div`w-1/2`

const Component = () => (
  <Container variant="light">
    <Column></Column>
    <Column></Column>
  </Container>
)
```

</details>

## Interpolation workaround

Due to Babel limitations, tailwind classes and arbitrary properties can’t have any part of them dynamically created.

So interpolated values like this won’t work:

```js
const Component = styled.div(({ spacing }) => [
  tw`mt-${spacing === 'sm' ? 2 : 4}`, // Won't work with tailwind classes
  `[margin-top:${spacing === 'sm' ? 2 : 4}rem]`, // Won't work with arbitrary properties
])
```

This is because babel doesn’t know the values of the variables and so twin can’t make a conversion to css.

Instead, define the classes in objects and grab them using props:

```js
import tw, { styled } from 'twin.macro'

const styles = { sm: tw`mt-2`, lg: tw`mt-4` }
const Card = styled.div(({ spacing }) => styles[spacing])

const Component = ({ spacing = 'sm' }) => <Card spacing={spacing} />
```

Or combine vanilla css with twins `theme` import:

```js
import { styled, theme } from 'twin.macro'

// Use theme values from your tailwind config
const styles = { sm: theme`spacing.2`, lg: theme`spacing.4` }
const Card = styled.div(({ spacing }) => ({ marginTop: styles[spacing] }))

const Component = ({ spacing = 'sm' }) => <Card spacing={spacing} />
```

Or you can always fall back to “vanilla css” which can interpolate anything:

```js
import { styled } from 'twin.macro'

const Card = styled.div(({ spacing }) => ({
  marginTop: `${spacing === 'sm' ? 2 : 4}rem`,
}))

const Component = ({ spacing = 'sm' }) => <Card spacing={spacing} />
```

## Overriding styles

You can use the `tw` jsx prop to override styles in the styled-component:

```tsx
import tw from 'twin.macro'

const Text = tw.div`text-white`

const Component = () => <Text tw="text-black">Has black text</Text>
```

## Extending components

Wrap components using the component extending feature to copy/override styles from another component:

```tsx
import tw, { styled } from 'twin.macro'

const Container = tw.div`bg-black text-white`

// Extend with tw: for basic styling
const BlueContainer = tw(Container)`bg-blue-500`
// Or extend with styled: For conditionals
const RedContainer = styled(Container)(({ hasBorder }) => [
  tw`bg-red-500 text-black`,
  hasBorder && tw`border`,
])

// Extending more than once like this is not recommended
const BlueContainerBold = tw(BlueContainer)`font-bold`

const Component = () => (
  <>
    <Container />
    <BlueContainer />
    <RedContainer hasBorder />
  </>
)
```

## Changing elements

Reuse styled components with a different element using the `as` prop:

```tsx
import tw from 'twin.macro'

const Heading = tw.h1`font-bold` // or styled.h1(tw`font-bold`)

const Component = () => (
  <>
    <Heading>I am a H1</Heading>
    <Heading as="h2">I am a H2 with the same style</Heading>
  </>
)
```

## Custom selectors (Arbitrary variants)

Use square-bracketed arbitrary variants to style elements with a custom selector:

```js
import tw from 'twin.macro'

const Button = tw.button`
  bg-black
  [> i]:block
  [> span]:(text-blue-500 w-10)
`

const Component = () => (
  <Button>
    <i>Icon</i>
    <span>Label</span>
  </Button>
)
```

<details>
  <summary>More examples</summary>

<br/>

```js
// Style the current element based on a theming/scoping className
const Theme = tw.div`[.dark-theme &]:(bg-black text-white)`
;<body className="dark-theme">
  <Theme>Dark theme</Theme>
</body>

// Add custom group selectors
const Text = tw.div`[.group:disabled &]:text-gray-500`
;<button className="group" disabled>
  <Text>Text gray</Text>
</button>

// Add custom height queries
const SmallHeightOnly = tw.div`[@media (min-height: 800px)]:hidden`
;<SmallHeightOnly>Burger menu</SmallHeightOnly>

// Use custom at-rules like @supports
const Grid = tw.div`[@supports (display: grid)]:grid`
;<Grid>A grid</Grid>

// Style the component based on a dynamic className
const Text = tw.div`text-base [&.is-large]:text-lg`
const Container = ({ isLarge }) => (
  <Text className={isLarge ? 'is-large' : null}>...</Text>
)
```

</details>

## Custom class values (Arbitrary values)

Custom values can be added to many tailwind classes by using square brackets to define the custom value:

```js
tw.div`top-[calc(100vh - 2rem)]`
// ↓ ↓ ↓ ↓ ↓ ↓
styled.div({ top: 'calc(100vh - 2rem)' })
```

[Read more about Arbitrary values →](https://github.com/ben-rogerson/twin.macro/blob/master/docs/arbitrary-values.md)

## Custom css

Basic css is added using [arbitrary properties](https://tailwindcss.com/docs/adding-custom-styles#arbitrary-properties) or within vanilla css which supports more advanced use cases like dynamic/interpolated values.

### Simple css styling

To add simple custom styling, use [arbitrary properties](https://tailwindcss.com/docs/adding-custom-styles#arbitrary-properties):

```js
// Set css variables
tw.div`[--my-width-variable:calc(100vw - 10rem)]`

// Set vendor prefixes
tw.div`[-webkit-line-clamp:3]`

// Set grid areas
tw.div`[grid-area:1 / 1 / 4 / 2]`
```

Use arbitrary properties with variants or twins grouping features:

```js
tw.div`block md:(relative [grid-area:1 / 1 / 4 / 2])`
```

Use a theme value to grab a value from your tailwind.config:

```js
tw.div`[color:theme('colors.gray.300')]`
tw.div`[margin:theme('spacing[2.5]')]`
tw.div`[box-shadow: 5px 10px theme('colors.black')]`
```

- Add a bang to make the custom css !important: `![grid-area:1 / 1 / 4 / 2]`
- Arbitrary properties can have camelCase properties: `[gridArea:1 / 1 / 4 / 2]`

### Advanced css styling

The styled import accepts a sass-like syntax, allowing both custom css and tailwind styles with values that can come from your tailwind config:

```js
import tw, { styled, css, theme } from 'twin.macro'

const Input = styled.div`
  ${css`
    -webkit-tap-highlight-color: transparent; /* add css styles */
    background-color: ${theme`colors.red.500`}; /* add values from your tailwind config */
    ${tw`text-blue-500 border-2`}; /* tailwind classes */

    &::selection {
      ${tw`text-purple-500`}; /* style custom css selectors with tailwind classes */
    }
  `}
`

const Component = () => <Input />
```

- Prefix css styles with the `css` import to apply css highlighting in your editor
- Add semicolons to the end of each line

It can be cleaner to use an object to add styles as it avoids the interpolation cruft seen in the last example:

```js
import tw, { styled, theme } from 'twin.macro'

const Input = styled.div({
  WebkitTapHighlightColor: 'transparent', // css properties are camelCased
  backgroundColor: theme`colors.red.500`, // values don’t require interpolation
  ...tw`text-blue-500 border-2`, // merge tailwind classes into the container

  '&::selection': tw`text-purple-500`, // allows single-line tailwind selector styling
})

const Component = () => <Input />
```

### Mixing css with tailwind classes

Mix tailwind classes and custom css in an array:

```js
import tw, { styled } from 'twin.macro'

const Input = styled.div(({ tapColor }) => [
  tw`block`,
  `-webkit-tap-highlight-color: ${tapColor};`,
])

const Component = () => <Input tapColor="red" />
```

When you move the styles out of jsx, prefix them with the `css` import:

```js
import tw, { styled, css } from 'twin.macro'

const widthStyles = ({ tapColor }) => css`
  -webkit-tap-highlight-color: ${tapColor};
`

const Input = styled.div(({ tapColor }) => [
  tw`block`,
  widthStyles({ tapColor }),
])

const Component = () => <Input tapColor="red" />
```

## Learn more

- [Prop styling guide](https://github.com/ben-rogerson/twin.macro/blob/master/docs/prop-styling-guide.md) - A must-read guide to level up on prop styling

## Resources

- [babel-plugin-twin](https://github.com/ben-rogerson/babel-plugin-twin) - Use the tw and css props without adding an import
- [React + Tailwind breakpoint syncing](https://gist.github.com/ben-rogerson/b4b406dffcc18ae02f8a6c8c97bb58a8) - Sync your tailwind.config.js breakpoints with react
- [Twin VSCode snippits](https://gist.github.com/ben-rogerson/c6b62508e63b3e3146350f685df2ddc9) - For devs who want to type less
- [Twin VSCode extensions](https://github.com/ben-rogerson/twin.macro/discussions/227) - For faster class suggestions and feedback

---

[&lsaquo; Documentation](https://github.com/ben-rogerson/twin.macro/blob/master/docs/index.md)
