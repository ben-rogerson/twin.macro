# Customizing the Tailwind config

For style customizations, add a `tailwind.config.js` in your project root.

> It’s important to know that you don’t need a `tailwind.config.js` to use Twin. You already have access to every class with every variant.

Choose from one of the following configs:

- a) Start with an empty config:

  ```js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        colors: {},
      },
    },
    plugins: [],
  }
  ```

- b) Start with a [full config](https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/defaultConfig.stub.js):

  ```bash
  # cd into your project folder then:
  npx tailwindcss-cli@latest init --full
  ```

  In the config, twin reads from the `darkMode`, `prefix`, `theme` and `plugins` entries, so feel free to remove the rest.

## Plugins

You can use most Tailwind plugins with twin, like [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography) and [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms).

Tip: You may see performance issues if plugins add a large number of classes.

## Resources

- Official [Tailwind theme docs](https://tailwindcss.com/docs/theme)

---

[&lsaquo; Documentation](https://github.com/ben-rogerson/twin.macro/blob/master/docs/index.md)
