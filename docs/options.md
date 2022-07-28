[](#twin-config-options)

# Twin config options

These options are available in your [twin config](#twin-config-location):

| Name              | Default                | Description                                                                                                                                                                                                                                   |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config            | `"tailwind.config.js"` | The path to your Tailwind config.                                                                                                                                                                                                             |
| preset            | `"emotion"`            | The css-in-js library behind the scenes.<br>Also supported: `"styled-components"` `"goober"` `"stitches"`                                                                                                                                     |
| hasSuggestions    | `true`                 | Display suggestions when a class isn’t found.                                                                                                                                                                                                 |
| dataTwProp        | `true`                 | Add a prop to jsx components in development showing the original tailwind classes.<br/> Use `"all"` to keep the prop in production.                                                                                                           |
| debug             | `false`                | Display information in your terminal about the Tailwind class conversions.                                                                                                                                                                    |
| disableShortCss   | `true`                 | Disable converting short css within the tw import/prop.                                                                                                                                                                                       |
| includeClassNames | `false`                | Look in className props for tailwind classes to convert.                                                                                                                                                                                      |
| dataCsProp        | `true`                 | Add a prop to your elements in development so you can see the original cs prop classes, eg: `<div data-cs="maxWidth[1em]" />`.                                                                                                                |
| disableCsProp     | `true`                 | Disable twin from reading values specified in the cs prop.                                                                                                                                                                                    |
| sassyPseudo       | `false`                | Some css-in-js frameworks require the `&` in selectors like `&:hover`, this option ensures it’s added.                                                                                                                                        |
| autoCssProp       | _deprecated in v2.8.2_ | `styled-components` only: Used to add an import of 'styled-components/macro' which automatically adds the styled-components css prop. Here’s how to [setup the new styled-components css prop](https://twinredirect.page.link/auto-css-prop). |

### Options

---

<details>

  <summary><strong>config</strong></summary>

<br />

```js
config: 'tailwind.config.js', // Path to the tailwind config
```

Set a custom location by specifying a path to your tailwind.config.js file.

**Monorepos / Workspaces**: The tailwind.config.js is commonly added as a shared file in the project root so you may need to add a `path.resolve` on the pathname in the twin config:

```js
// babel-plugin-macros.config.js
const path = require('path')

module.exports = {
  twin: {
    config: path.resolve(__dirname, '../../', 'tailwind.config.js'),
  },
}
```

</details>

---

<details>

  <summary><strong>preset</strong></summary>

<br />

```js
preset: 'emotion', // Set the css-in-js library to use with twin
```

Supports: `'emotion'` / `'styled-components'` / `'goober'` / `'stitches'`.

The preset option primarily assigns the library imports for `css`, `styled` and `GlobalStyles`.

</details>

---

<details>

  <summary><strong>hasSuggestions</strong></summary>

<br />

```js
hasSuggestions: false, // Set the display of suggestions when a class isn’t found
```

Set `hasSuggestions` to `false` to remove the display of suggestions in your terminal.

</details>

---

<details>

  <summary><strong>dataTwProp</strong></summary>

<br />

```js
dataTwProp: false, // Set the display of the data-tw prop on jsx elements
```

The `data-tw` prop gets added to your elements while in development so you can see the original tailwind classes:

```js
<div data-tw="bg-black" />
```

If you add the value `all`, twin will add the data-tw prop in production as well as development.

</details>

---

<details>

  <summary><strong>debug</strong></summary>

<br />

```js
debug: true, // Display information about class conversions
```

When debug mode is on, twin displays logs on class conversions.
This feedback only displays in development.

</details>

---

<details>

  <summary><strong>disableShortCss</strong></summary>

<br />

```js
disableShortCss: false, // Enable converting short css within the tw import/prop
```

When set to `true`, this will throw an error if short css is added within the tw import or tw prop.

Disable short css completely with `dataCsProp: false`.

</details>

---

<details>

  <summary><strong>includeClassNames</strong></summary>

<br />

```js
includeClassNames: true, // Check className props for tailwind classes to convert
```

When a tailwind class is found in a className prop, it’s plucked out, converted and delivered to the css-in-js library.

- Unmatched classes are skipped and preserved within the className
- Suggestions aren’t shown for unmatched classes like they are for the tw prop
- The tw and css props can be used on the same jsx element
- Limitation: classNames with conditional props or variables aren’t touched, eg: `<div className={isBlock && "block"} />`

</details>

---

<details>

  <summary><strong>dataCsProp</strong></summary>

<br />

```js
dataCsProp: false, // JSX prop twin adds that shows the original cs prop classes
```

If you add short css within the `cs` prop then twin will add a `data-cs` prop to preserve the css you added.
This option controls the display of the prop.

Shows in development only.

</details>

---

<details>

  <summary><strong>disableCsProp</strong></summary>

<br />

```js
disableCsProp: true, // Whether to read short css values added in a `cs` prop
```

If you're using the cs prop for something else or don’t want other developers using the feature you can disable it with this option.

</details>

---

<details>

  <summary><strong>sassyPseudo</strong></summary>

<br />

```js
sassyPseudo: true, // Prefix pseudo selectors with a `&`
```

Some css-in-js frameworks require the `&` in selectors like `&:hover`, this option ensures it’s added.

</details>

---

[](#twin-config-location)

## Twin config location

Twin’s config can be added in a couple of different files.

a) Either in `babel-plugin-macros.config.js`:

```js
// babel-plugin-macros.config.js
module.exports = {
  twin: {
    // add options here
  },
}
```

b) Or in `package.json`:

```js
// package.json
"babelMacros": {
  "twin": {
    // add options here
  }
},
```

---

[&lsaquo; Documentation index](https://github.com/ben-rogerson/twin.macro/blob/master/docs/index.md)
