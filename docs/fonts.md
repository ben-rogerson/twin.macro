# Fonts

You can add `@font-face` definitions either [in the global styles provider](#add-the-font-face-in-the-global-styles-provider) or [in a traditional .css file](#add-the-font-face-in-a-traditional-css-file).

## Add `@font-face` in the Global styles provider

An option is to add the font with the global provider that comes with your css-in-js library. Here are some examples:

### Styled-components

```js
// styles/GlobalStyles.js
import React from 'react'
import { createGlobalStyle } from 'styled-components'
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro'

const CustomStyles = createGlobalStyle`
  @font-face {
    font-family: 'Foo';
    src: url('/path/to/exampleFont.woff') format('woff');
    font-style: normal;
    font-weight: 400;
    /* https://styled-components.com/docs/faqs#how-do-i-fix-flickering-text-after-server-side-rendering */
    font-display: fallback;
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
)

export default GlobalStyles
```

[createGlobalStyle docs →](https://styled-components.com/docs/api#createglobalstyle)

### Emotion

```js
// styles/GlobalStyles.js
import React from 'react'
import { Global, css } from '@emotion/react'
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro'

const customStyles = css`
  @font-face {
    font-family: 'Foo';
    src: url('/path/to/exampleFont.woff') format('woff');
    font-style: normal;
    font-weight: 400;
    /* https://styled-components.com/docs/faqs#how-do-i-fix-flickering-text-after-server-side-rendering */
    font-display: fallback;
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles
```

[Global docs →](https://emotion.sh/docs/globals)

### Goober

```js
// styles/GlobalStyles.js
import React from 'react'
import { createGlobalStyle } from 'styled-components'
import tw, { GlobalStyles as BaseStyles } from 'twin.macro'

const CustomStyles = createGlobalStyle`
  @font-face {
    font-family: 'Foo';
    src: url('/path/to/exampleFont.woff') format('woff');
    font-style: normal;
    font-weight: 400;
    /* https://styled-components.com/docs/faqs#how-do-i-fix-flickering-text-after-server-side-rendering */
    font-display: fallback;
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
)

export default GlobalStyles
```

[createGlobalStyle docs →](https://goober.js.org/api/createGlobalStyles)

## Add the `@font-face` in a .css file and import it

This method may help to remove text flickering in some frameworks.

```css
/* styles/fonts.css */
@font-face {
  font-family: 'Foo';
  src: url('/path/to/exampleFont.woff') format('woff');
  font-style: normal;
  font-weight: 400;
  font-display: fallback;
}
```

```js
// index.js / _app.js
import '../styles/fonts.css'
// ...
```
