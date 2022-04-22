# Using the group className

There’s only one Tailwind class that can’t be used within `tw` prop or function and that’s the `group` class. It needs to be added as a className so variants like `group-hover:` will work correctly when added to the children.

Here are the rest of the group variants you can use with Twin:

- `group-hover`
- `group-focus`
- `group-hocus` - A combination of hover and focus
- `group-active`
- `group-visited`

Using the group className with the `tw` prop is similar to vanilla Tailwind. Adding the group as a className on an ancestor allows the group variants to work as intended on the child elements:

```js
import 'twin.macro'

export default () => (
  <button className="group">
    <div tw="group-hover:bg-black">Child 1</div>
    <div tw="group-hover:font-bold">Child 2</div>
  </button>
)
```

When working in emotion and styled-components without the `group` classes, the equivalent looks like this:

```js
import tw, { styled } from 'twin.macro'

const Group = tw.button``
Group.Child1 = styled.div`
  ${Group}:hover & {
    ${tw`bg-black`}
  }
`
Group.Child2 = styled.div`
  ${Group}:hover & {
    ${tw`font-bold`}
  }
`

export default () => (
  <Group>
    <Group.Child1>Child 1</Group.Child1>
    <Group.Child2>Child 2</Group.Child2>
  </Group>
)
```

Not as great right?

Here’s some ways you can improve upon that:

## Attrs in 💅&nbsp;styled&#8209;components

In styled-components we have a `styled` function called `attrs`.
Here’s what the docs have to say about it:

> The rule of thumb is to use attrs when you want every instance of a styled component to have that prop, and pass props directly when every instance needs a different one.<br/>- [styled-components docs](https://styled-components.com/docs/faqs#when-to-use-attrs)

But we can also put it to use to define the `group` class in Tailwind.

Rather than adding `className="group"` directly onto your jsx element, the class can be more tightly coupled with your styles:

```js
import tw, { styled } from 'twin.macro'

const Group = styled.button.attrs({ className: 'group' })``

Group.Child1 = tw.div`group-hover:bg-black`
Group.Child2 = tw.div`group-hover:font-bold`

export default () => (
  <Group>
    <Group.Child1>Child 1</Group.Child1>
    <Group.Child2>Child 2</Group.Child2>
  </Group>
)
```

## Attrs in emotion

Unfortunately emotion [doesn’t have any plans](https://github.com/emotion-js/emotion/issues/821) to add `attrs` so the easiest option is to add `className="group"` directly on the jsx element:

```js
import tw from 'twin.macro'

const Group = tw.button``
Group.Child1 = tw.div`group-hover:bg-black`
Group.Child2 = tw.div`group-hover:font-bold`

export default () => (
  <Group className="group">
    <Group.Child1>Child 1</Group.Child1>
    <Group.Child2>Child 2</Group.Child2>
  </Group>
)
```

But if you’d like similar functionality to the attr function in styled-components then you could add the className using a [Higher-Order Component (HOC)](https://reactjs.org/docs/higher-order-components.html):

```js
import tw from 'twin.macro'

const withAttrs = (Component, attrs) => props =>
  <Component {...attrs} {...props} />

const Button = tw.button``
const Group = withAttrs(Button, { className: 'group' })

Group.Child1 = tw.div`group-hover:bg-black`
Group.Child2 = tw.div`group-hover:font-bold`

export default () => (
  <Group>
    <Group.Child1>Child 1</Group.Child1>
    <Group.Child2>Child 2</Group.Child2>
  </Group>
)
```

You could also use `defaultProps` but it’s [going to be deprecated at some stage](https://twitter.com/dan_abramov/status/1133878326358171650), which is a shame because it’s a really nice way to add the className:

```js
import tw from 'twin.macro'

const Group = tw.button``
Group.defaultProps = { className: 'group' }

Group.Child1 = tw.div`group-hover:bg-black`
Group.Child2 = tw.div`group-hover:font-bold`

export default () => (
  <Group>
    <Group.Child1>Child 1</Group.Child1>
    <Group.Child2>Child 2</Group.Child2>
  </Group>
)
```

## Resources

- [Quick Start Guide to Attrs in styled-components](https://scalablecss.com/styled-components-attrs/)
- [Emotion issue: .attrs equivalent](https://github.com/emotion-js/emotion/issues/821)

---

[&lsaquo; Documentation](https://github.com/ben-rogerson/twin.macro/blob/master/docs/index.md)
