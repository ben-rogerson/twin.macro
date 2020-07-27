# Customizing your Tailwind config

For style customizations, add a `tailwind.config.js` in your project root (or in `src` if you’re using create-react-app).

> It’s important to know that you don’t need a `tailwind.config.js` to use Twin. You already have access to every class with every variant.
> Unlike Tailwind, twin.macro only generates styles for the classes you use. This means you don’t need to use additional tools like purgeCSS.

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
  curl https://raw.githubusercontent.com/tailwindcss/tailwindcss/master/stubs/defaultConfig.stub.js > tailwind.config.js
  ```

  In the config, twin only reads from the `theme: {}` and the `plugins: []` entries, so you can strip the rest.

Read the official [Tailwind theme docs](https://tailwindcss.com/docs/theme) for more information.

## Plugins

You can use Tailwind plugins like [Tailwind UI](https://tailwindui.com/components) and [Custom forms](https://github.com/tailwindcss/custom-forms) but there’s no compatibility with other plugins that use the `addVariant` or `addBase` functions.

Check out the [list of supported plugins →](https://twin-docs.netlify.app/plugin-support)

## Next steps

- [Styling with the css prop](../css-prop-guide.md)
- [Styling with the styled import](../styled-import-guide.md)
