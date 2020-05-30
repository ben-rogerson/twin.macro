# Twin and Tailwind differences

This document outlines the feature differences between Twin and Tailwind.

## Additional features

- tw can be imported as a named import<br/>eg: `import { tw } from 'twin.macro'`<br/>You'll receive errors in a TypeScript project though
- `container` has left/right margins
- `container` has left/right paddings
- Variants can be stacked<br/>eg: `md:before:flex!`
- You can add a negative value to just about any measurement class

## Twin doesn't have

- [Class prefixes](https://tailwindcss.com/docs/configuration/#prefix)
- [Custom separators](https://tailwindcss.com/docs/configuration/#separator)
- You can't disable [core plugins](https://tailwindcss.com/docs/configuration/#core-plugins)
- Twin doesn't have an `important` option in your config<br/>Use the trailing bang feature instead, eg: `flex!`
- You can't limit the available variants on each class, all of them are always available
