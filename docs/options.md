[](#twin-config-options)

# Twin config options

These options are available in your [twin config](#twin-config-location):

| Name                        | Default                | Description                                                                                                                         |
| --------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| config                      | `"tailwind.config.js"` | The path to your Tailwind config. Also takes a config object.                                                                       |
| preset                      | `"emotion"`            | The css-in-js library behind the scenes.<br>Also supported: `"styled-components"` `"goober"` `"stitches"` `"solid"`                 |
| dataTwProp                  | `true`                 | Add a prop to jsx components in development showing the original tailwind classes.<br/> Use `"all"` to keep the prop in production. |
| debug                       | `false`                | Display information in your terminal about the Tailwind class conversions.                                                          |
| disableShortCss             | `true`                 | Disable converting short css within the tw import/prop.                                                                             |
| hasLogColors                | `true`                 | Disable log colors to remove the glyphs when the color display is not supported                                                     |
| includeClassNames           | `false`                | Check className attributes for tailwind classes to convert.                                                                         |
| dataCsProp                  | `true`                 | Add a prop to your elements in development so you can see the original cs prop classes, eg: `<div data-cs="maxWidth[1em]" />`.      |
| disableCsProp               | `true`                 | Disable twin from reading values specified in the cs prop.                                                                          |
| sassyPseudo                 | `false`                | Some css-in-js frameworks require the `&` in selectors like `&:hover`, this option ensures it’s added.                              |
| moveKeyframesToGlobalStyles | `false`                | `@keyframes` are added next to the `animation-x` classes - this option can move them to global styles instead.                      |

### Options

---

<details>

  <summary><strong>config</strong></summary>

<br />

```js
config: 'tailwind.config.js', // Path to the tailwind config
```

Set a custom location by specifying a path to your tailwind.config.js file.

**Passing in a config**: The config option also accepts a config object:

```js
// babel-plugin-macros.config.js
const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: '#ff0000',
      },
    },
  },
}

module.exports = {
  twin: {
    config: tailwindConfig,
  },
}
```

This can be useful in component libraries, tests, or just to remove the need for a tailwind.config.js file.

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

## </details>

---

<details>

  <summary><strong>hasLogColors</strong></summary>

<br />

```js
hasLogColors: false, // Disable log colors (removes those glyphs in your console/overlay)
```

Sometimes the display of errors and suggestions are pretty poor due to lack of support for custom colors. Use this setting to disable the colors so you can actually read the messages.

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

<details>

  <summary><strong>moveKeyframesToGlobalStyles</strong></summary>

<br />

```js
moveKeyframesToGlobalStyles: true, // Avoid @keyframes next to animation-x classes
```

Add `@keyframes` matching an `animation-x` class to global styles instead of alongside the `animation-x` class.<br/>
In stitches this gets set to `true` to make animations work.

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
