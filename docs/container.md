# Container

The `container` class restricts an element’s width to the current breakpoint.

The margins and paddings can be independently set at each breakpoint to accommodate designs with specific horizontal layout positioning.

## Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: ['2rem', '3rem'],
        lg: ['4rem', '5rem'],
        xl: ['5rem', '6rem'],
        '2xl': '7rem',
      },
      margin: {
        DEFAULT: '1rem',
        sm: ['2rem', '3rem'],
        lg: ['4rem', '5rem'],
        xl: ['5rem', '6rem'],
        '2xl': '7rem',
      },
      // center: true, // Centering will disable any margin styles
    },
  },
}
```

## Usage

#### tw prop

```js
import 'twin.macro'

const Container = ({ children, ...rest }) => (
  <div {...rest} tw="container">
    {children}
  </div>
)
```

#### styled components

```js
import tw from 'twin.macro'

const Container = tw.div`container`

const Component = ({ children, ...rest }) => (
  <Container {...rest}>{children}</Container>
)
```

## Resources

- [Tailwind container docs](https://tailwindcss.com/docs/container)
