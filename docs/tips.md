# Styling tips

## Prop styling

### ✓ Keep line lengths shorter with booleans

Ternaries are great for small class sets:

```js
const inputStyles = ({ hasDarkTheme }) => [
  hasDarkTheme ? tw`bg-black` : tw`text-white`,
]
```

With longer class sets, use booleans to keep line lengths short:

```js
const inputStyles = ({ hasDarkTheme }) => [
  hasDarkTheme && tw`bg-black text-white placeholder-gray-700`,
  !hasDarkTheme && tw`bg-white text-black placeholder-gray-300`,
]
```

### ✓ Move common styles to a shared styling file

Reusable styles should be shifted into a shared file:

```js
// commonStyles.js
export const layout = {
  container: ({ hasDarkTheme }) => [
    tw`flex w-full`,
    hasDarkTheme && tw`bg-black text-white`,
  ],
  column: tw`w-1/2 border-t`,
}
```

Attach shared styles to jsx elements with the css prop:

```js
// app.js
import 'twin.macro'
import { layout } from './commonStyles'

const Component = ({ hasDarkTheme }) => (
  <div css={layout.container({ hasDarkTheme })}>
    <div css={layout.column} />
    <div css={layout.column} />
  </div>
)
```

### ✓ Use class grouping with large styling sets

Group large style sets by their type on multiple lines:

```js
const styles = tw`
  block relative
  text-black bg-gray-100
  // ...
`
const Component = () => <div css={styles} />
```

Or use group with brackets and pipes on single lines:

```js
<div tw="block (ml-1 mr-2)" />
// or
<div tw="block | ml-1 mr-2" />
```
