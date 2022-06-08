# Arbitrary values

Twin supports the same arbitrary values syntax popularized by Tailwind’s [jit ("Just-in-Time") mode](https://tailwindcss.com/docs/just-in-time-mode).

```js
tw`top-[calc(100vh - 2rem)]`
// ↓ ↓ ↓ ↓ ↓ ↓
;({ top: 'calc(100vh - 2rem)' })
```

Arbitrary values use square brackets to allow custom css values instead of classes built from your tailwind.config.js.

This is a good solution for those unique “once off” values that every project requires which you may not want to add to your tailwind.config.js.

## Supported classes

Generally the rule is: Dynamic classes - like `bg-red-500` - support arbitrary values, while static classes like `block` don’t.

> For fully custom css properties and values use [arbitrary properties](https://tailwindcss.com/docs/adding-custom-styles#arbitrary-properties).

## Spaces in values

In Tailwind, when we add classes within the className prop/attribute, values cannot have spaces in them.

```js
// Spaced values won’t work in Tailwind
;<div className="h-[calc(1000px - 4rem)]" />
```

But with twin, spaces are okay because Twin is not restricted by the spacing rules of the className prop:

```js
// Twin supports values with spaces
;<div tw="h-[calc(1000px - 4rem)]" />

// Classes can be added on multiple lines when using template literals
;<div
  css={tw`
    h-[calc(1000px - 4rem)]
`}
/>
```

## Dynamic values

Just like Tailwind, values can't be dynamically added because Twin doesn’t have the ability to read the variables before converting to a css object:

```js
// Dynamic values without the tw call won’t work
;<div css={tw`mt-[${size === 'lg' ? '22px' : '17px'}]`}></div>
```

You’ll need to use a full tw class definition to make dynamic values possible:

```js
// Dynamic values work when constructed like this
;<div css={[size === 'lg' ? tw`mt-[22px]` : tw`mt-[17px]`]}></div>
```

## Resources

- [The PR for arbitrary values](https://github.com/ben-rogerson/twin.macro/pull/447)

---

[&lsaquo; Documentation](https://github.com/ben-rogerson/twin.macro/blob/master/docs/index.md)
