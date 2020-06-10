# Container

Custom paddings on the `container` class were introduced in Tailwind v1.4 and also in Twin shortly after.

Twin adds another feature and that is custom independent left/right margins and paddings.
This can be used on layouts that are a little more creative with their horizontal layout positioning.

## Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      margin: {
        default: '1rem',
        sm: ['2rem', '3rem'],
        lg: ['4rem', '5rem'],
        xl: ['5rem', '6rem'],
      },
      padding: {
        default: '1rem',
        sm: ['2rem', '3rem'],
        lg: ['4rem', '5rem'],
        xl: ['5rem', '6rem'],
      },
      // Setting center will disable any margin styles
      // center: true,
    },
  },
}
```

## Usage

#### tw prop

```js
import 'twin.macro'

export default ({ children, ...rest }) => (
  <div {...rest} tw="container">
    {children}
  </div>
)
```

#### styled components

```js
import tw from 'twin.macro'

const Container = tw.div`container`

export default ({ children, ...rest }) => (
  <Container {...rest}>{children}</Container>
)
```

## Resources

- [Tailwind container docs](https://tailwindcss.com/docs/container/#app)
