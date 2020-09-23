# Avoid adding the animate-xxx keyframes

If you’re not planning on using Tailwinds `animate-xxx` classes then you won’t need their matching `@keyframes` either.

Twin adds the [@keyframes](https://github.com/ben-rogerson/twin.macro/blob/master/src/config/globalStyles.js) and also the Tailwind [preflight base styles](https://unpkg.com/tailwindcss/dist/base.css) to your project with `<GlobalStyles />`, so here’s the alternative:

```js
import 'tailwindcss/dist/base.min.css'
```

Add that to the same file you define GlobalStyles within - except if you're using Gatsby in which case you should add it to `gatsby-browser.js`.

You don’t need to install `tailwindcss` yourself as twin installs it automatically as a dependency.
