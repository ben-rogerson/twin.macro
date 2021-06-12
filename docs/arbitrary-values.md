# Arbitrary values

Twin supports the same arbitrary values syntax popularized by Tailwind’s [jit ("Just-in-Time") mode](https://tailwindcss.com/docs/just-in-time-mode#enabling-jit-mode).

```js
tw`top-[calc(100vh - 2rem)]`
// ↓ ↓ ↓ ↓ ↓ ↓
;({ top: 'calc(100vh - 2rem)' })
```

Similar twin’s “[short css](https://github.com/ben-rogerson/twin.macro/pull/305)” syntax, arbitrary values use square brackets to allow custom css values instead of classes built from your tailwind.config.js.

This is a good solution for those unique “once off” values that every project requires which you may not want to add to your tailwind.config.js.

## Supported classes

Generally the rule is: Dynamic classes - like `bg-red-500` - support arbitrary values, while static classes like `block` don’t.

> If you need to add custom css for a class that doesn’t have support, consider using the twin’s “[short css](https://github.com/ben-rogerson/twin.macro/pull/305)” syntax.

<details>
<summary>View supported classes...</summary>

This list of tailwind classes support arbitrary values:

```js
tw`top-[50px]`
tw`bottom-[50px]`
tw`left-[50px]`
tw`right-[50px]`
tw`inset-y-[50px]`
tw`inset-x-[50px]`
tw`inset-[50px]`

tw`z-[-1]`

tw`flex-grow-[1]`
tw`flex-shrink-[1]`

tw`order-[1]`

tw`grid-cols-[repeat(5, minmax(0, 5fr))]`
tw`grid-rows-[repeat(5, minmax(0, 5fr))]`
tw`auto-cols-[minmax(0, 5fr)]`
tw`auto-rows-[minmax(0, 5fr)]`

tw`gap-[50px]`
tw`gap-x-[50px]`
tw`gap-y-[50px]`

tw`pt-[50px]`
tw`pr-[50px]`
tw`pb-[50px]`
tw`pl-[50px]`
tw`px-[50px]`
tw`py-[50px]`
tw`p-[50px]`

tw`mt-[50px]`
tw`mr-[50px]`
tw`mb-[50px]`
tw`ml-[50px]`
tw`mx-[50px]`
tw`my-[50px]`
tw`m-[50px]`

tw`w-[50px]`
tw`min-w-[50px]`
tw`max-w-[50px]`
tw`h-[50px]`
tw`min-h-[50px]`
tw`max-h-[50px]`

tw`tracking-[50px]`
tw`leading-[50px]`

tw`text-opacity-[0.5]`
tw`text-[red]`

tw`bg-opacity-[0.5]`
tw`bg-[red]`

tw`from-[red]`
tw`via-[orange]`
tw`to-[yellow]`

tw`border-t-[50px]`
tw`border-b-[50px]`
tw`border-l-[50px]`
tw`border-r-[50px]`
tw`border-opacity-[0.5]`
tw`border-[50px]`

tw`rounded-tl-[50px]`
tw`rounded-tr-[50px]`
tw`rounded-br-[50px]`
tw`rounded-bl-[50px]`
tw`rounded-t-[50px]`
tw`rounded-r-[50px]`
tw`rounded-b-[50px]`
tw`rounded-l-[50px]`
tw`rounded-[50px]`

tw`ring-opacity-[0.5]`
tw`ring-offset-[50px]`
tw`ring-[50px]`

tw`opacity-[0.5]`
tw`blur-[0.5]`
tw`brightness-[0.5]`
tw`contrast-[0.5]`
tw`grayscale-[0.5]`
tw`hue-rotate-[25deg]`
tw`invert-[0.5]`
tw`saturate-[0.5]`
tw`sepia-[0.5]`

tw`backdrop-blur-[0.5]`
tw`backdrop-brightness-[0.5]`
tw`backdrop-contrast-[0.5]`
tw`backdrop-grayscale-[0.5]`
tw`backdrop-hue-rotate-[25deg]`
tw`backdrop-invert-[0.5]`
tw`backdrop-opacity-[0.5]`
tw`backdrop-saturate-[0.5]`
tw`backdrop-sepia-[0.5]`

tw`scale-x-[0.5]`
tw`scale-y-[0.5]`
tw`scale-[0.5]`
tw`rotate-[25deg]`
tw`translate-x-[10px]`
tw`translate-y-[10px]`
tw`skew-x-[10px]`
tw`skew-y-[10px]`
tw`cursor-[help]`
tw`fill-[red]`
tw`stroke-[red]`
```

</details>

## Spaces in values

In Tailwind, the classes are added with the className prop, so values cannot have spaces in them.

```js
// Values with spaces won’t work in Tailwind
;<div className="h-[calc(1000px - 4rem)]" />
```

But with twin, spaces are allowed because Twin is not restricted by the rules of classes sitting in a className/class prop:

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

- [Tailwind jit ("Just-in-Time") mode announcement](https://tailwindcss.com/docs/just-in-time-mode#enabling-jit-mode)
- [The PR for arbitrary values](https://github.com/ben-rogerson/twin.macro/pull/447)

---

[&lsaquo; Documentation](https://github.com/ben-rogerson/twin.macro/blob/master/docs/index.md)
