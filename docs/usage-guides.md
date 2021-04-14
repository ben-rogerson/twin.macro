# Usage guides

Twin has two major styling types:

## Prop styling

Style existing elements with the `tw` and `css` props:

```js
<input tw="text-black rounded" />
// or
<input css={tw`text-black rounded`} />
```

[Prop styling guide →](https://github.com/ben-rogerson/twin.macro/blob/master/docs/prop-styling-guide.md)

## Styled components

Create and style jsx elements with the `styled` import:

```js
const Input = tw.div`text-black rounded`
// or
const Input = styled.div(tw`text-black rounded`)

<Input />
```

[Styled component guide →](https://github.com/ben-rogerson/twin.macro/blob/master/docs/styled-component-guide.md)

<!-- ## Choosing prop styling

Here are some reasons to use prop styling rather than styled components:

### Similar to styling with tailwind

Instead of adding classes in the `class` attribute, they are added in the `tw` prop:

```js
// In tailwind
<div class="bg-black text-white" />

// In twin.macro
<div tw="bg-black text-white" />
```

- Twin can also convert classes added in the `className` attribute with the [includeClassNames](https://github.com/ben-rogerson/twin.macro/blob/master/docs/options.md#includeClassNames) feature

### Less imports to use

A single nameless import activates the tw prop:

```js
import 'twin.macro'
;<div tw="inline" />
```

- Install [babel-plugin-twin](https://github.com/ben-rogerson/babel-plugin-twin) to use the `tw` prop without an import

### Better debugging in devtools

After twin converts your classes, it adds them to a `data-tw` prop to display in your dev tools:

```js
<div tw="inline" />

// ↓ ↓ ↓ ↓ ↓ ↓

<div css={{ display: "inline" }} data-tw="inline" />;
```

- By default, the [data-tw prop](<(https://github.com/ben-rogerson/twin.macro/blob/master/docs/options.md#dataTwProp)>) doesn’t show up in production -->
